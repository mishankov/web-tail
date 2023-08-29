<script lang="ts">
  export let line: string;
  export let selectRegex: RegExp;
</script>

<div class="line">
  {#if "".match(selectRegex) === null}
    <span
      >{@html line.replaceAll(
        selectRegex,
        '<span class="selected-log-line">$&</span>'
      )}</span
    >
  {:else}
    <span>{line}</span>
  {/if}
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
</style>
