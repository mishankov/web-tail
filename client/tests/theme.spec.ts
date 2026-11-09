import { expect, test, type Page, type WebSocketRoute } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const sampleLogs = Array.from({ length: 26 }, (_, i) => {
  const messages = [
    "INFO  api-gateway  request completed method=GET path=/health status=200 duration=4ms",
    "INFO  worker       job completed queue=events processed=128 duration=42ms",
    "WARN  database     connection pool nearing capacity active=18 max=20",
    "INFO  api-gateway  request completed method=POST path=/events status=202 duration=12ms",
    "INFO  scheduler    heartbeat received server=production-02 region=eu-central",
    "ERROR worker       upstream timeout service=notifications retry_in=5s",
  ];
  return `2026-11-09 14:32:${String(i).padStart(2, "0")}  ${messages[i % messages.length]}`;
});

async function mockSources(page: Page) {
  await page.route("**/sources", route => route.fulfill({ json: ["production / api-gateway", "production / worker"] }));
  let connection: WebSocketRoute | undefined;
  let connections = 0;
  await page.routeWebSocket("**/logstream/**", socket => {
    connections++;
    connection = socket;
    socket.send(sampleLogs.join("\n"));
  });
  return { send: (line: string) => connection!.send(line), count: () => connections };
}

async function expectTheme(page: Page, theme: "light" | "dark") {
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", theme === "dark" ? "#0e1614" : "#f6f9f7");
  await expect.poll(() => page.locator("html").evaluate(el => getComputedStyle(el).colorScheme)).toBe(theme);
}

test.beforeEach(async ({ page }) => {
  await mockSources(page);
});

test("System follows OS changes; explicit selection persists and overrides the OS", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const theme = page.getByLabel("Theme", { exact: true });
  await expect(theme).toHaveValue("system");
  await expectTheme(page, "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expectTheme(page, "dark");
  await theme.selectOption("light");
  await expectTheme(page, "light");
  await page.reload();
  await expect(theme).toHaveValue("light");
  await expectTheme(page, "light");
  await page.emulateMedia({ colorScheme: "light" });
  await theme.selectOption("dark");
  await expectTheme(page, "dark");
  await page.reload();
  await expect(theme).toHaveValue("dark");
  await expectTheme(page, "dark");
  await theme.selectOption("system");
  await expectTheme(page, "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expectTheme(page, "dark");
});

for (const saved of ["{broken", "null", '{"theme":"unknown"}', '{"reverseLogs":true,"logWindow":500}']) {
  test(`existing/invalid settings safely default to System: ${saved}`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem("WebTailSettings", value), saved);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.getByLabel("Theme", { exact: true })).toHaveValue("system");
    await expectTheme(page, "dark");
    if (saved.includes("reverseLogs")) {
      await expect(page.getByLabel("Max lines")).toHaveValue("500");
      await expect(page.getByRole("button", { name: "Reverse" })).toHaveClass(/selected/);
    }
  });
}

for (const method of ["getItem", "setItem"] as const) {
  test(`themes work when storage ${method} throws`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(method => {
      Storage.prototype[method] = () => { throw new DOMException("Storage unavailable", "SecurityError"); };
    }, method);
    await page.goto("/");
    await page.getByLabel("Theme", { exact: true }).selectOption("dark");
    await expectTheme(page, "dark");
    await page.getByLabel("Theme", { exact: true }).selectOption("light");
    await expectTheme(page, "light");
    expect(errors).toEqual([]);
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`saved ${theme} theme applies before the app module loads`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme === "light" ? "dark" : "light" });
    await page.addInitScript(theme => localStorage.setItem("WebTailSettings", JSON.stringify({ theme })), theme);
    await page.route("**/assets/*.js", route => route.abort());
    await page.goto("/");
    await expectTheme(page, theme);
    await expect(page.locator("#app")).toBeEmpty();
  });
}

test("keyboard selection preserves the search draft, source, matches and active stream", async ({ page }) => {
  const stream = await mockSources(page);
  await page.goto("/");
  await page.getByLabel("Source", { exact: true }).selectOption("production / api-gateway");
  await expect(page.locator(".line")).toHaveCount(sampleLogs.length);
  await page.getByLabel("Search logs").fill("request");
  await page.getByRole("button", { name: "Next search result", exact: true }).click();
  const activeLine = await page.locator(".line:has(.selected-search-result)").textContent();
  await page.getByLabel("Max lines").focus();
  await page.keyboard.press("Tab");
  const selector = page.getByLabel("Theme", { exact: true });
  await expect(selector).toBeFocused();
  // Native type-to-select also works with macOS headless Chromium, where
  // arrow-driven native popup menus are not exposed to browser automation.
  await page.keyboard.press("l");
  await page.keyboard.press("Tab");
  await expect(selector).toHaveValue("light");
  await expectTheme(page, "light");
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("d");
  await page.keyboard.press("Tab");
  await expect(selector).toHaveValue("dark");
  await expectTheme(page, "dark");
  await expect(page.getByLabel("Search logs")).toHaveValue("request");
  await expect(page.getByLabel("Source", { exact: true })).toHaveValue("production / api-gateway");
  await expect(page.locator(".line:has(.selected-search-result)")).toHaveText(activeLine!);
  expect(stream.count()).toBe(1);
  stream.send("INFO request completed after theme change");
  await expect(page.locator(".line")).toHaveCount(sampleLogs.length + 1);
  expect(stream.count()).toBe(1);
});

test("controls and logs fit at desktop, tablet, mobile and enlarged text sizes", async ({ page }) => {
  await page.goto("/");
  for (const width of [1440, 1200, 1100, 768, 700, 699, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const fontSize of [16, 20]) {
      await page.locator("html").evaluate((el, size) => el.style.fontSize = `${size}px`, fontSize);
      await expect.poll(() => page.evaluate(() => {
        const controls = document.querySelector("header")!.getBoundingClientRect();
        const logs = document.querySelector(".logs")!.getBoundingClientRect();
        return logs.top >= controls.bottom;
      })).toBe(true);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      expect(overflow, `overflow at width ${width}, font ${fontSize}`).toBe(false);
      await expect(page.getByLabel("Theme", { exact: true })).toBeInViewport();
    }
  }
});

test("capture completed light/dark themes with sample streamed logs", async ({ page }) => {
  const output = process.env.WEB_TAIL_SCREENSHOT_DIR;
  test.skip(!output, "Set WEB_TAIL_SCREENSHOT_DIR to capture review screenshots.");
  await mkdir(output!, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByLabel("Source", { exact: true }).selectOption("production / api-gateway");
  await expect(page.locator(".line")).toHaveCount(sampleLogs.length);
  await page.getByLabel("Search logs").fill("request");
  await page.getByRole("button", { name: "Next search result", exact: true }).click();
  for (const theme of ["light", "dark"] as const) {
    await page.getByLabel("Theme", { exact: true }).selectOption(theme);
    await expectTheme(page, theme);
    await page.getByLabel("Theme", { exact: true }).blur();
    await page.screenshot({ path: join(output!, `${theme}-desktop.png`), animations: "disabled" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: join(output!, `${theme}-mobile.png`), animations: "disabled" });
    await page.setViewportSize({ width: 1440, height: 900 });
  }
});
