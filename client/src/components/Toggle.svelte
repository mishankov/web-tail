
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
    color: var(--color-light-100);
    background-color: var(--color-dark-100);
    border: 0;
    border-radius: 100vh;
    font-size: 1.25rem;
    height: 2rem;
    padding-left: 0.6rem;
    padding-right: 0.5rem;
    display: flex;
    align-items: center;
    user-select: none;

    transition: background-color 0.1s;
  }

  button:hover {
    background-color: var(--color-dark-80);
  }

  button:active {
    background-color: var(--color-dark-60);
  }

  .selected {
    background-color: var(--color-dark-80);
  }
</style>
