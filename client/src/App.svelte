<script lang="ts">
    import { onMount } from "svelte";
    import Logs from "./pages/Logs.svelte";
    import { settingsState } from "./state/settings.svelte";
    import { applyTheme } from "./theme";

    $effect(() => applyTheme(settingsState.theme));

    onMount(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const update = () => applyTheme(settingsState.theme);
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    });
</script>

<Logs />
