
<script lang="ts">
  import { logsState, setFilteredLogs } from "../state/logs.svelte";
  import { settingsState } from "../state/settings.svelte";
  import type { CircularBufferItem } from "../types/CircularBuffer";
  import { escapeRegExp, smoothScroll } from "../utils";
  import LogLine from "./LogLine.svelte";

  interface Props {
    searchString: string;
    source: string;
  }

  let { searchString, source }: Props = $props();

  let selectRegex = $state(new RegExp("", "gi"));
  let scrollAnchor = $state<HTMLElement | null>(null);

  const logsToShow = $derived(
    settingsState.filterLogs ? logsState.filtered : logsState.all
  );

  $effect(() => {
    const sourceLogs = logsState.all;
    const regexFlags = settingsState.caseSensitive ? "g" : "gi";

    let nextRegex: RegExp;
    if (settingsState.regexFilter) {
      try {
        nextRegex = new RegExp(searchString, regexFlags);
      } catch {
        nextRegex = new RegExp(escapeRegExp(searchString), regexFlags);
      }
    } else {
      nextRegex = new RegExp(escapeRegExp(searchString), regexFlags);
    }

    selectRegex = nextRegex;

    let nextFiltered: CircularBufferItem<string>[] = sourceLogs.filter(
      (log) => log.item.match(nextRegex) !== null
    );

    if (settingsState.reverseLogs) {
      nextFiltered = [...nextFiltered].reverse();
    }

    setFilteredLogs(nextFiltered);
  });

  $effect(() => {
    if (!source || settingsState.reverseLogs || !scrollAnchor) {
      return;
    }

    const timeout = setTimeout(() => {
      if (scrollAnchor) {
        smoothScroll(scrollAnchor);
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  });
</script>

<div class="logs">
  {#each logsToShow as logLine (logLine.id)}
    <LogLine line={logLine} {selectRegex} />
  {/each}
  <div class="scroll-anchor" bind:this={scrollAnchor}></div>
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
