
<script lang="ts">
  import { setSetting, settingsState } from "../state/settings.svelte";
  import { loadSources, sourcesState } from "../state/sources.svelte";
  import { MAX_LOG_WINDOW_SIZE, MIN_LOG_WINDOW_SIZE } from "../types/CircularBuffer";
  import SearchBar from "./SearchBar.svelte";
  import Toggle from "./Toggle.svelte";

  interface Props {
    source: string;
    searchString: string;
  }

  let {
    source = $bindable(""),
    searchString = $bindable(""),
  }: Props = $props();

  void loadSources();

  function updateLogWindow(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    setSetting("logWindow", Number(input.value));
  }
</script>

<header>
  <nav class="top-panel">
    <select
      class="source-select"
      aria-label="Source"
      bind:value={source}
    >
      <option value="">Select source</option>
      {#each sourcesState.items as sourceName (sourceName)}
        <option value={sourceName}>{sourceName}</option>
      {/each}
    </select>
    <SearchBar bind:searchString {source} />
    <Toggle
      label="Filter"
      value={settingsState.filterLogs}
      onToggle={(next) => setSetting("filterLogs", next)}
    />
    <Toggle
      title="Regex"
      label=".*"
      value={settingsState.regexFilter}
      onToggle={(next) => setSetting("regexFilter", next)}
    />
    <Toggle
      title="Case sensitive"
      label="Aa"
      value={settingsState.caseSensitive}
      onToggle={(next) => setSetting("caseSensitive", next)}
    />
    <Toggle
      label="Reverse"
      value={settingsState.reverseLogs}
      onToggle={(next) => setSetting("reverseLogs", next)}
    />
    <input
      aria-label="Max lines"
      title="Max Lines"
      type="number"
      placeholder="Max lines"
      class="top-panel-input max-lines-input"
      value={settingsState.logWindow}
      min={MIN_LOG_WINDOW_SIZE}
      max={MAX_LOG_WINDOW_SIZE}
      step="1"
      oninput={updateLogWindow}
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

  .top-panel > *:focus-visible {
    outline: 2px solid var(--color-accent-100);
    outline-offset: 1px;
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
