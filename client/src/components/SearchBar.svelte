
<script lang="ts">
  import { logsState } from "../state/logs.svelte";
  import { searchState } from "../state/search.svelte";

  interface Props {
    searchString: string;
    source: string;
  }

  let {
    searchString = $bindable(""),
    source,
  }: Props = $props();

  $effect(() => {
    if (searchString) {
      searchState.currentLineId = "";
    }
  });

  $effect(() => {
    source;
    searchState.currentLineId = "";
  });

  $effect(() => {
    if (searchState.currentLineId === "") {
      return;
    }

    const hasCurrent = logsState.filtered.some(
      (line) => line.id === searchState.currentLineId,
    );

    if (!hasCurrent) {
      searchState.currentLineId = "";
    }
  });

  function goToSearchResult(direction: "next" | "previous") {
    if (searchString === "" || logsState.filtered.length === 0) {
      return;
    }

    const currentIndex = logsState.filtered.findIndex(
      (line) => line.id === searchState.currentLineId,
    );

    if (direction === "next") {
      if (currentIndex === -1) {
        searchState.currentLineId = logsState.filtered[0].id;
      } else {
        searchState.currentLineId =
          logsState.filtered[(currentIndex + 1) % logsState.filtered.length].id;
      }
    }

    if (direction === "previous") {
      if (currentIndex === -1) {
        searchState.currentLineId = logsState.filtered[logsState.filtered.length - 1].id;
      } else {
        const previousIndex =
          (currentIndex - 1 + logsState.filtered.length) % logsState.filtered.length;
        searchState.currentLineId = logsState.filtered[previousIndex].id;
      }
    }
  }
</script>

<div
  class="search-shell"
  class:has-value={searchString.length > 0}
  class:has-results={searchString.length > 0 && logsState.filtered.length > 0}
>
  <input
    type="text"
    placeholder="Search"
    aria-label="Search logs"
    bind:value={searchString}
  />
  <button
    class="button-left"
    disabled={searchString.length === 0 || logsState.filtered.length === 0}
    aria-label="Previous search result"
    onclick={() => goToSearchResult("previous")}
    title="Previous line with search result">&lt;</button>
  <button
    class="button-right"
    disabled={searchString.length === 0 || logsState.filtered.length === 0}
    aria-label="Next search result"
    onclick={() => goToSearchResult("next")}
    title="Next line with search result">&gt;</button>
</div>

<style>
  .search-shell {
    width: 100%;
    display: flex;
    align-items: center;
    min-width: 0;
    height: var(--control-height);
    border-radius: var(--radius-pill);
    border: 1px solid hsl(154 22% 27% / 0.75);
    background-color: var(--glass-bg-strong);
    box-shadow: inset 0 1px 0 hsl(150 30% 80% / 0.04);
    transition:
      border-color var(--transition-fast) ease,
      background-color var(--transition-fast) ease,
      box-shadow var(--transition-fast) ease;
  }

  .search-shell:hover {
    border-color: hsl(152 25% 35% / 0.9);
    background-color: hsl(172 18% 16% / 0.95);
  }

  .search-shell:focus-within {
    border-color: hsl(144 53% 48% / 0.95);
    box-shadow:
      inset 0 1px 0 hsl(150 30% 80% / 0.04),
      0 0 0 2px hsl(144 58% 48% / 0.2);
  }

  .search-shell.has-value {
    background-color: hsl(172 18% 16% / 0.95);
  }

  .search-shell.has-results {
    border-color: hsl(144 54% 40% / 0.95);
  }

  input {
    width: 100%;
    min-width: 0;
    color: var(--text-0);
    background-color: transparent;
    border: 0;
    font-family: var(--font-ui);
    font-size: 0.95rem;
    line-height: 1;
    height: 100%;
    padding: 0 0.75rem;
    border-top-left-radius: var(--radius-pill);
    border-bottom-left-radius: var(--radius-pill);
  }

  input:focus {
    outline: none;
  }

  input::placeholder {
    color: var(--text-1);
  }

  input:focus::placeholder {
    color: transparent;
  }

  button {
    width: 2rem;
    color: var(--text-0);
    background-color: transparent;
    border: 0;
    font-size: 1rem;
    font-weight: 600;
    font-family: var(--font-ui);
    height: 100%;
    padding: 0;
    transition:
      color var(--transition-fast) ease,
      background-color var(--transition-fast) ease;
  }

  button:hover:enabled {
    color: hsl(145 65% 82%);
    background-color: hsl(154 25% 23% / 0.9);
  }

  button:enabled:active {
    background-color: hsl(152 26% 20%);
  }

  button:focus-visible {
    outline: 2px solid hsl(144 58% 48% / 0.8);
    outline-offset: -2px;
  }

  button:disabled {
    color: hsl(155 10% 42%);
    cursor: not-allowed;
  }

  .button-left {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 0.4rem;
    border-bottom-right-radius: 0.4rem;
  }

  .button-right {
    border-top-right-radius: var(--radius-pill);
    border-bottom-right-radius: var(--radius-pill);
  }

  @media (prefers-reduced-motion: reduce) {
    .search-shell,
    button {
      transition-duration: 1ms;
    }
  }
</style>
