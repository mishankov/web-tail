<script lang="ts">
    import Logs from "./pages/Logs.svelte";
</script>

<Logs />

<style>
    :global(:root) {
        --bg-0: hsl(168 22% 7%);
        --bg-1: hsl(171 20% 10%);
        --bg-2: hsl(173 18% 14%);
        --line: hsl(165 26% 20%);
        --text-0: hsl(150 24% 90%);
        --text-1: hsl(153 14% 72%);
        --green-accent: hsl(144 58% 48%);
        --green-accent-soft: hsl(144 44% 24%);
        --match-amber: hsl(45 100% 62%);
        --match-amber-text: hsl(170 30% 8%);
        --active-result: hsl(188 70% 58%);

        --glass-bg: hsl(172 28% 10% / 0.82);
        --glass-bg-strong: hsl(171 24% 11% / 0.9);
        --glass-border: hsl(153 22% 30% / 0.6);

        --control-height: 2.25rem;
        --radius-lg: 1rem;
        --radius-md: 0.75rem;
        --radius-pill: 999px;

        --shadow-soft: 0 0.75rem 2.2rem hsl(170 30% 4% / 0.42);
        --transition-fast: 140ms;
        --transition-mid: 170ms;
        --layout-top-offset: 5rem;

        --font-ui: "Avenir Next", "Segoe UI", "SF Pro Text", "Helvetica Neue", sans-serif;
        --font-mono: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    :global(body) {
        color: var(--text-0);
        background:
            radial-gradient(120% 140% at -10% -20%, hsl(146 57% 20% / 0.25), transparent 45%),
            radial-gradient(100% 120% at 105% 0%, hsl(173 76% 14% / 0.33), transparent 48%),
            linear-gradient(145deg, var(--bg-0), hsl(172 24% 8%));
        font-family: var(--font-ui);
    }

    :global(body)::before {
        content: "";
        position: fixed;
        inset: 0;
        background:
            repeating-linear-gradient(
                0deg,
                transparent 0,
                transparent 2px,
                hsl(145 20% 70% / 0.02) 2px,
                hsl(145 20% 70% / 0.02) 3px
            );
        pointer-events: none;
        z-index: -1;
    }

    :global(::selection) {
        color: var(--match-amber-text);
        background: hsl(45 100% 62% / 0.85);
    }

    :global(main) {
        height: 100%;
    }
</style>
