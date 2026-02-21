
<script lang="ts">
  import fetchSources from "../stores/sources";
  import {
    caseSensitive,
    filterLogs,
    logWindow,
    regexFilter,
    reverseLogs,
  } from "../stores/settings";
  import SearchBar from "./SearchBar.svelte";
  import Toggle from "./Toggle.svelte";

  interface Props {
    source: string;
    searchString: string;
  }

  const { sources } = fetchSources();

  let {
    source = $bindable(""),
    searchString = $bindable(""),
  }: Props = $props();
</script>

<header>
  <nav class="top-panel">
    <select class="source-select" bind:value={source}>
      <option value="">Select source</option>
      {#each $sources as sourceName (sourceName)}
        <option value={sourceName}>{sourceName}</option>
      {/each}
    </select>
    <SearchBar bind:searchString />
    <Toggle label="Filter" bind:value={$filterLogs} />
    <Toggle title="Regex" label=".*" bind:value={$regexFilter} />
    <Toggle
      title="Case sensitive"
      label="Aa"
      bind:value={$caseSensitive}
    />
    <Toggle label="Reverse" bind:value={$reverseLogs} />
    <input
      title="Max Lines"
      type="number"
      placeholder="Max lines"
      class="top-panel-input max-lines-input"
      bind:value={$logWindow}
    />
  </nav>
</header>

<style>
  .top-panel {
    position: fixed;
    top: 0;
    left: 0;
    min-width: calc(100vw - 0.8rem);
    height: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5em;
    border: 0.4rem solid var(--color-dark-100);
    background-color: var(--color-dark-100);
  }

  .top-panel > * {
    color: var(--color-light-100);
    background-color: var(--color-dark-100);
    border: 0;
    border-radius: 100vh;
    font-size: 1.25rem;
    height: 2rem;
    padding: 0 0.5rem;
    transition: background-color 0.1s;
  }

  .top-panel > *:hover {
    background-color: var(--color-dark-80);
  }

  .top-panel-input:focus {
    background-color: var(--color-dark-60);
    outline: none;
  }

  .top-panel-input:focus::placeholder {
    color: transparent;
  }

  .source-select {
    outline: none;
  }

  .max-lines-input {
    width: 7ch;
  }
</style>
