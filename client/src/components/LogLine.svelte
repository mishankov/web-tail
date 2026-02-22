
<script lang="ts">
  import { searchState } from "../state/search.svelte";
  import { smoothScroll } from "../utils";

  interface LinePart {
    matched: boolean;
    text: string;
  }

  interface Props {
    line: { id: string; item: string };
    selectRegex: RegExp;
  }

  let { line, selectRegex }: Props = $props();

  let lineParts = $state<LinePart[]>([]);
  let lineElement = $state<HTMLElement | null>(null);
  const isCurrentSearchResult = $derived(searchState.currentLineId === line.id);

  $effect(() => {
    if (isCurrentSearchResult && lineElement) {
      smoothScroll(lineElement);
    }
  });

  function splitLineByMatches(text: string, regex: RegExp): LinePart[] {
    if ("".match(regex) !== null) {
      return [{ matched: false, text }];
    }

    const parts: LinePart[] = [];
    const pattern = new RegExp(regex.source, regex.flags);
    let cursor = 0;

    for (const match of text.matchAll(pattern)) {
      const matchValue = match[0];
      const index = match.index ?? 0;

      if (index > cursor) {
        parts.push({ matched: false, text: text.slice(cursor, index) });
      }

      if (matchValue.length > 0) {
        parts.push({ matched: true, text: matchValue });
      }

      cursor = index + matchValue.length;
    }

    if (cursor < text.length) {
      parts.push({ matched: false, text: text.slice(cursor) });
    }

    if (parts.length === 0) {
      return [{ matched: false, text }];
    }

    return parts;
  }

  $effect(() => {
    lineParts = splitLineByMatches(line.item, selectRegex);
  });
</script>

<div bind:this={lineElement} class="line">
  {#each lineParts as part, index (`${line.id}-${index}`)}
    {#if part.matched}
      <span class="selected-log-line" class:selected-search-result={isCurrentSearchResult}>
        {part.text}
      </span>
    {:else}
      <span>{part.text}</span>
    {/if}
  {/each}
</div>

<style>
  .line {
    font-family: monospace;
    font-size: 1rem;
    padding: 0.3em;
    color: var(--color-light-100);
    border-bottom: 1px solid var(--color-dark-100);
    overflow-anchor: none;
  }

  .selected-log-line {
    background-color: var(--color-accent-100);
    color: var(--color-dark-100);
    padding: 1px 2px;
    border: 1px solid var(--color-dark-100);
    border-radius: 10px;
  }

  .selected-search-result {
    background-color: var(--color-accent-secondary-100);
  }
</style>
