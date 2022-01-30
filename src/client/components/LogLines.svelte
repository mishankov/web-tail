<script lang="ts">
    import LogLine from "./LogLine.svelte";
    import { logs } from "../stores/logs";
    import { filterLogs, reverseLogs } from "../stores/settings";

    export let searchString: string;

    let filteredLogs: {id: string, item: string}[] = [];

    $: {
        filteredLogs = $logs.toArray().filter((log) => {
            return !$filterLogs || $filterLogs && log.item.includes(searchString)
        });

        if ($reverseLogs) filteredLogs.reverse();
    }
    
</script>


<div class="logs">
    {#each filteredLogs as logLine(logLine.id)}
        <LogLine line={logLine.item} selectLine={searchString}/>
    {/each}
</div>

<style>
    .logs {
        position: fixed;
        left: 0;
        top: 2.8rem;
        min-height: calc(100vh - 2.8rem);
        width: 100%;
        max-height: calc(100vh - 2.8rem);
        background-color: var(--color-dark-80);
        overflow: auto;
    }
</style>