
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

  const baseLogsToShow = $derived(
    settingsState.filterLogs ? logsState.filtered : logsState.all
  );

  const logsToShow = $derived(
    settingsState.reverseLogs ? [...baseLogsToShow].reverse() : baseLogsToShow
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
    font-family: var(--font-mono);
    left: 0.6rem;
    right: 0.6rem;
    top: var(--layout-top-offset);
    bottom: 0.6rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--log-border);
    background:
      repeating-linear-gradient(
        0deg,
        transparent 0,
        transparent 22px,
        var(--log-stripe) 22px,
        var(--log-stripe) 23px
      ),
      var(--log-bg);
    box-shadow:
      var(--log-inset),
      var(--log-shadow);
    overflow: auto;
    overflow-wrap: break-word;
    scrollbar-color: var(--scroll-thumb) var(--scroll-track);
    scrollbar-width: thin;
  }

  .logs::-webkit-scrollbar {
    width: 0.85rem;
    height: 0.85rem;
  }

  .logs::-webkit-scrollbar-track {
    background: var(--scroll-track);
  }

  .logs::-webkit-scrollbar-thumb {
    border: 3px solid var(--scroll-track);
    border-radius: 999px;
    background: linear-gradient(180deg, var(--scroll-thumb), var(--scroll-thumb-end));
  }

  .logs::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, var(--scroll-hover), var(--scroll-hover-end));
  }

  .scroll-anchor {
    overflow-anchor: auto;
    height: 1px;
  }

  @media (max-width: 699px) {
    .logs {
      left: 0.45rem;
      right: 0.45rem;
      bottom: 0.45rem;
    }
  }
</style>
