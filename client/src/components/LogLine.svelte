
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
    border-bottom: 1px solid hsl(153 20% 20% / 0.7);
    background-color: transparent;
    transition:
      background-color var(--transition-fast) ease,
      border-color var(--transition-fast) ease;
    overflow-anchor: none;
  }

  .line:nth-child(even) {
    background-color: hsl(168 18% 14% / 0.34);
  }

  .line:hover {
    background-color: hsl(150 20% 18% / 0.68);
    border-bottom-color: hsl(145 24% 28% / 0.9);
  }

  .selected-log-line {
    background-color: var(--match-amber);
    color: var(--match-amber-text);
    padding: 0.02rem 0.17rem;
    border: 1px solid hsl(45 90% 34%);
    border-radius: 0.35rem;
    box-shadow: inset 0 1px 0 hsl(49 90% 75% / 0.4);
  }

  .selected-search-result {
    background-color: var(--active-result);
    color: hsl(173 34% 10%);
    border-color: hsl(188 64% 33%);
    box-shadow: 0 0 0 1px hsl(188 73% 44%);
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
