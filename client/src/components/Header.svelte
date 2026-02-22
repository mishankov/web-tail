
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

<header class="header-shell">
  <nav class="top-panel" aria-label="Log controls">
    <div class="source-group">
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
    </div>

    <div class="search-group">
      <SearchBar bind:searchString {source} />
    </div>

    <div class="toggle-group">
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
    </div>

    <div class="window-group">
      <label class="window-label" for="max-lines-input">Lines</label>
      <input
        id="max-lines-input"
        aria-label="Max lines"
        title="Max Lines"
        type="number"
        placeholder="1000"
        class="top-panel-input max-lines-input"
        value={settingsState.logWindow}
        min={MIN_LOG_WINDOW_SIZE}
        max={MAX_LOG_WINDOW_SIZE}
        step="1"
        oninput={updateLogWindow}
      />
    </div>
  </nav>
</header>

<style>
  :global(:root) {
    --layout-top-offset: 5.1rem;
  }

  .header-shell {
    position: sticky;
    top: 0;
    z-index: 20;
    padding: 0.6rem 0.7rem 0.4rem;
  }

  .top-panel {
    display: grid;
    grid-template-columns: minmax(12rem, 17rem) minmax(15rem, 1fr) auto auto;
    align-items: center;
    gap: 0.55rem;
    padding: 0.5rem;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, hsl(169 24% 10% / 0.9), hsl(173 30% 8% / 0.75));
    box-shadow: var(--shadow-soft);
    backdrop-filter: blur(13px) saturate(130%);
    animation: dock-in 220ms cubic-bezier(0.18, 0.88, 0.32, 1) both;
  }

  .source-group,
  .search-group,
  .toggle-group,
  .window-group {
    min-width: 0;
  }

  .search-group {
    display: flex;
  }

  .toggle-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .source-select,
  .top-panel-input {
    width: 100%;
    height: var(--control-height);
    border: 1px solid hsl(154 22% 27% / 0.75);
    border-radius: var(--radius-pill);
    background-color: var(--glass-bg-strong);
    color: var(--text-0);
    font-size: 0.95rem;
    line-height: 1;
    padding: 0 0.75rem;
    transition:
      border-color var(--transition-fast) ease,
      background-color var(--transition-fast) ease,
      box-shadow var(--transition-fast) ease;
  }

  .source-select {
    appearance: none;
    cursor: pointer;
  }

  .source-select:hover,
  .top-panel-input:hover {
    background-color: hsl(172 18% 16% / 0.92);
    border-color: hsl(152 25% 35% / 0.9);
  }

  .source-select:focus,
  .top-panel-input:focus {
    outline: none;
  }

  .source-select:focus-visible,
  .top-panel-input:focus-visible {
    border-color: hsl(144 53% 48% / 0.95);
    box-shadow: 0 0 0 2px hsl(144 58% 48% / 0.2);
  }

  .top-panel-input::placeholder {
    color: var(--text-1);
  }

  .window-group {
    display: flex;
    justify-self: end;
    align-items: center;
    gap: 0.45rem;
  }

  .window-label {
    font-size: 0.72rem;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-1);
  }

  .max-lines-input {
    width: 7ch;
    text-align: right;
    font-variant-numeric: tabular-nums;
    appearance: textfield;
    -moz-appearance: textfield;
  }

  .max-lines-input::-webkit-outer-spin-button,
  .max-lines-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (max-width: 1099px) {
    :global(:root) {
      --layout-top-offset: 7.55rem;
    }

    .top-panel {
      grid-template-columns: minmax(11rem, 1fr) minmax(12rem, 1fr) auto;
      align-items: start;
    }

    .source-group {
      grid-column: 1 / 2;
    }

    .search-group {
      grid-column: 2 / 4;
    }

    .toggle-group {
      grid-column: 1 / 3;
    }

    .window-group {
      grid-column: 3 / 4;
      align-self: center;
    }
  }

  @media (max-width: 699px) {
    :global(:root) {
      --layout-top-offset: 9.6rem;
    }

    .header-shell {
      padding: 0.5rem 0.5rem 0.35rem;
    }

    .top-panel {
      grid-template-columns: minmax(7.25rem, 0.9fr) minmax(9rem, 1.1fr);
      gap: 0.45rem;
    }

    .source-group {
      grid-column: 1 / 2;
    }

    .search-group {
      grid-column: 2 / 3;
    }

    .toggle-group {
      grid-column: 1 / 2;
    }

    .window-group {
      grid-column: 2 / 3;
      justify-self: stretch;
      justify-content: flex-end;
    }

    .window-label {
      display: none;
    }
  }

  @keyframes dock-in {
    from {
      opacity: 0;
      transform: translateY(-0.45rem);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .top-panel {
      animation: none;
    }

    .top-panel,
    .top-panel * {
      transition-duration: 1ms !important;
    }
  }
</style>
