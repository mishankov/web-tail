<script lang="ts">
  import LogLine from "./LogLine.svelte";
  import { escapeRegExp, smoothScroll } from "../utils";
  import { logs, filteredLogs } from "../stores/logs";
  import {
    filterLogs,
    reverseLogs,
    regexFilter,
    caseSensitive,
  } from "../stores/settings";
    import { onMount } from "svelte";

  export let searchString: string;
  export let source: string;

  let selectRegex: RegExp;
  let logsToShow: {id: string, item: string}[];

  let scrollAnchor: HTMLElement;

  $: {
    filteredLogs.set($logs.toArray().filter((log) => {
      let regexFlags = "gi";

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

      return (
        log.item.match(selectRegex) !== null
      );
    }));

    if ($reverseLogs) filteredLogs.update(n => n.reverse());
  }

  $: if ($filterLogs) {
    logsToShow = $filteredLogs;
  } else {
    logsToShow = $logs.toArray();
  }

  $: if (source) {
    setTimeout(() => { smoothScroll(scrollAnchor); }, 100);
  }

</script>

<div class="logs">
  {#each logsToShow as logLine (logLine.id)}
    <LogLine line={logLine} {selectRegex} />
  {/each}
  <div class="scroll-anchor" bind:this={scrollAnchor} />
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
    overflow-wrap: break-word;
  }

  .scroll-anchor {
    overflow-anchor: auto;
    height: 1px;
  }
</style>
