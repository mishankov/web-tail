
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
    font-family: var(--font-mono);
    font-size: 0.9375rem;
    line-height: 1.35;
    padding: 0.375rem 0.625rem;
    color: var(--text-0);
    border-bottom: 1px solid var(--row-border);
    background-color: transparent;
    transition:
      background-color var(--transition-fast) ease,
      border-color var(--transition-fast) ease;
    overflow-anchor: none;
  }

  .line:nth-child(even) {
    background-color: var(--row-even);
  }

  .line:hover {
    background-color: var(--row-hover);
    border-bottom-color: var(--row-hover-border);
  }

  .selected-log-line {
    background-color: var(--match-amber);
    color: var(--match-amber-text);
    padding: 0.02rem 0.17rem;
    border: 1px solid var(--match-border);
    border-radius: 0.35rem;
    box-shadow: var(--match-shadow);
  }

  .selected-search-result {
    background-color: var(--active-result);
    color: var(--active-result-text);
    border-color: var(--active-result-border);
    box-shadow: 0 0 0 1px var(--active-result-ring);
  }

  @media (max-width: 699px) {
    .line {
      font-size: 0.875rem;
      padding: 0.35rem 0.55rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .line {
      transition-duration: 1ms;
    }
  }
</style>
