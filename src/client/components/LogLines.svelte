<script lang="ts">
    import LogLine from "./LogLine.svelte";
    import { logs } from "../stores/logs";
    import { filterLogs, reverseLogs, regexFilter } from "../stores/settings";

    export let searchString: string;

    let filteredLogs: {id: string, item: string}[] = [];
    let selectRegex: RegExp;

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    $: {
        filteredLogs = $logs.toArray().filter((log) => {
            if ($regexFilter) {
                try {
                    selectRegex = new RegExp(searchString, "g");
                } catch {
                    selectRegex = new RegExp(escapeRegExp(searchString), "g");
                }

                return !$filterLogs || $filterLogs && log.item.match(selectRegex) !== null
            } else {
                return !$filterLogs || $filterLogs && log.item.includes(searchString)
            }
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
