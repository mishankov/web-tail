
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

<div class:has-value={searchString.length > 0}>
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
  div {
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 100vh;
    transition: background-color 0.1s;
  }

  div:hover {
    background-color: var(--color-dark-80);
  }

  div:focus-within {
    background-color: var(--color-dark-80);
  }

  div.has-value {
    background-color: var(--color-dark-80);
  }

  input {
    width: 100%;
    color: var(--color-light-100);
    background-color: transparent;
    border: 0;
    border-top-left-radius: 100vh;
    border-bottom-left-radius: 100vh;
    font-size: 1.25rem;
    height: 2rem;
    padding: 0 0.5rem;
  }

  input:focus {
    outline: none;
  }

  input:focus-visible {
    outline: 2px solid var(--color-accent-100);
    outline-offset: -2px;
  }

  input:focus::placeholder {
    color: transparent;
  }

  button {
    color: var(--color-light-100);
    background-color: transparent;
    border: 0;
    font-size: 1.25rem;
    height: 2rem;
    padding: 0 0.5rem;
    transition: background-color 0.1s;
  }

  button:enabled:active {
    background-color: var(--color-dark-60);
    outline: none;
  }

  button:focus-visible {
    outline: 2px solid var(--color-accent-100);
    outline-offset: -2px;
  }

  button:disabled {
    color: var(--color-dark-60);
  }

  .button-left {
    border-top-left-radius: 100vh;
    border-bottom-left-radius: 100vh;
  }

  .button-right {
    border-top-right-radius: 100vh;
    border-bottom-right-radius: 100vh;
  }
</style>
