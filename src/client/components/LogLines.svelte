<script lang="ts">
    import LogLine from "./LogLine.svelte";
    import { escapeRegExp } from "../utils";
    import { logs } from "../stores/logs";
    import { filterLogs, reverseLogs, regexFilter, caseSensitive } from "../stores/settings";

    export let searchString: string;

    let filteredLogs: {id: string, item: string}[] = [];

    $: {
        filteredLogs = $logs.toArray().filter((log) => {
            let regexFlags = "gi";
            let selectRegex: RegExp;

            if ($caseSensitive) regexFlags = "g";

            if ($regexFilter) {
                try {
                    selectRegex = new RegExp(searchString, regexFlags);
                } catch {
                    selectRegex = new RegExp(escapeRegExp(searchString), regexFlags);
                }
            } else {
                selectRegex = new RegExp(escapeRegExp(searchString), regexFlags);
            }

            return !$filterLogs || $filterLogs && log.item.match(selectRegex) !== null
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
