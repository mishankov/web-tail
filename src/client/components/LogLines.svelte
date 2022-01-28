<script lang="ts">
    import LogLine from "./LogLine.svelte";
    import { logs } from "../stores/logs";

    export let searchString: string;
    export let isFiltered: boolean;
    export let isReversed: boolean;
</script>
