<script lang="ts">
  import { currentSearchLineId } from "../stores/search";
  import { smoothScroll } from "../utils";

  export let line: {id: string, item: string};
  export let selectRegex: RegExp;
  
  let searchResultClass: string;
  let lineToShow = line.item;
  let lineElement: HTMLElement;

  function onSearchLineIdChange(newLineId: string) {
    if (newLineId === line.id) {
      searchResultClass = "selected-log-line selected-search-result";
      smoothScroll(lineElement);
    } else {
      searchResultClass = "selected-log-line";
    }
  }

  $: onSearchLineIdChange($currentSearchLineId);

  $: if ("".match(selectRegex) === null) {
    lineToShow = line.item.replaceAll(selectRegex, `<span class="${searchResultClass}" id="line-id-${line.id}">$&</span>`)
  } else {
    lineToShow = line.item;
  }
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
