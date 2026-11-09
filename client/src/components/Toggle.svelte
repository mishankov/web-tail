
<script lang="ts">
  interface Props {
    label: string;
    title?: string;
    value: boolean;
    onToggle: (next: boolean) => void;
  }

  let { label, title = "", value, onToggle }: Props = $props();

  function toggle() {
    onToggle(!value);
  }
</script>

<button type="button" {title} class:selected={value} onclick={toggle}>
  {label}
</button>

<style>
  button {
    color: var(--text-0);
    background-color: var(--glass-bg-strong);
    border: 1px solid var(--control-border);
    border-radius: var(--radius-pill);
    font-size: 0.92rem;
    font-weight: 550;
    font-family: var(--font-ui);
    height: var(--control-height);
    padding-left: 0.72rem;
    padding-right: 0.68rem;
    display: flex;
    align-items: center;
    user-select: none;
    cursor: pointer;

    transition:
      border-color var(--transition-fast) ease,
      background-color var(--transition-fast) ease,
      box-shadow var(--transition-fast) ease,
      color var(--transition-fast) ease;
  }

  button:hover {
    border-color: var(--control-hover-border);
    background-color: var(--control-hover-bg);
  }

  button:active {
    background-color: var(--control-active-bg);
  }

  .selected {
    color: var(--selected-text);
    border-color: var(--selected-border);
    background:
      var(--selected-bg);
    box-shadow:
      var(--selected-shadow);
  }

  button:focus {
    outline: none;
  }

  button:focus-visible {
    border-color: var(--focus-border);
    box-shadow: 0 0 0 2px var(--focus-ring);
  }

  @media (prefers-reduced-motion: reduce) {
    button {
      transition-duration: 1ms;
    }
  }
</style>
