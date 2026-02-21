
<script lang="ts">
  import { currentSearchLineId } from "../stores/search";
  import { smoothScroll } from "../utils";

  interface Props {
    line: { id: string; item: string };
    selectRegex: RegExp;
  }

  let { line, selectRegex }: Props = $props();

  let searchResultClass = $state("selected-log-line");
  let lineToShow = $state("");
  let lineElement = $state<HTMLElement | null>(null);

  $effect(() => {
    if ($currentSearchLineId === line.id) {
      searchResultClass = "selected-log-line selected-search-result";
      if (lineElement) {
        smoothScroll(lineElement);
      }
    } else {
      searchResultClass = "selected-log-line";
    }
  });

  $effect(() => {
    if ("".match(selectRegex) === null) {
      lineToShow = line.item.replaceAll(
        selectRegex,
        `<span class="${searchResultClass}" id="line-id-${line.id}">$&</span>`
      );
      return;
    }

    lineToShow = line.item;
  });
</script>

<div bind:this={lineElement} class="line">
  <span>{@html lineToShow}</span>
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

  :global(.selected-log-line) {
    background-color: var(--color-accent-100);
    color: var(--color-dark-100);
    padding: 1px 2px;
    border: 1px solid var(--color-dark-100);
    border-radius: 10px;
  }

  :global(.selected-search-result) {
    background-color: var(--color-accent-secondary-100);
  }
</style>
