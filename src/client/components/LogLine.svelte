<script lang="ts">
    import { lastSearchResult, selectedSearchResult } from "../stores/search";

  export let line: string;
  export let selectRegex: RegExp;

  const searchResult = lastSearchResult.next();
  
  let searchResultClass: string;
  let lineToShow = line;

  $: if ($selectedSearchResult === searchResult) {
    searchResultClass = "selected-log-line selected-search-result"
  } else {
    searchResultClass = "selected-log-line"
  }

  $: if ("".match(selectRegex) === null) {
    lineToShow = line.replaceAll(selectRegex, `<span class="${searchResultClass}" id="search-result-${searchResult}">$&</span>`)
  }
</script>

<div class="line">
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
    padding: 2px;
    border: 1px solid var(--color-dark-100);
    border-radius: 10px;
  }

  :global(.selected-search-result) {
    background-color: green;
  }
</style>
