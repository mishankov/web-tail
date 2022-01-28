import { writable } from "svelte/store";

const storedFilterLogs = localStorage.getItem("WebTailFilterLogs");
export const filterLogs = writable(storedFilterLogs === "true" || false);
filterLogs.subscribe((value) =>
  localStorage.setItem("WebTailFilterLogs", value.toString())
);

const storedRegexFilter = localStorage.getItem("WebTailRegexFilter");
export const regexFilter = writable(storedRegexFilter === "true" || false);
regexFilter.subscribe((value) =>
  localStorage.setItem("WebTailRegexFilter", value.toString())
);

const storedReverseLogs = localStorage.getItem("WebTailReverseLogs");
export const reverseLogs = writable(storedReverseLogs === "true" || false);
reverseLogs.subscribe((value) =>
  localStorage.setItem("WebTailReverseLogs", value.toString())
);

const storedLogWindow = localStorage.getItem("WebTailLogWindow");
export const logWindow = writable(storedLogWindow || "10");
logWindow.subscribe((value) => localStorage.setItem("WebTailLogWindow", value));
