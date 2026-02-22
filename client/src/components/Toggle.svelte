
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
    border: 1px solid hsl(154 22% 27% / 0.75);
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
    border-color: hsl(152 25% 35% / 0.9);
    background-color: hsl(172 18% 16% / 0.95);
  }

  button:active {
    background-color: hsl(152 26% 20%);
  }

  .selected {
    color: hsl(146 82% 92%);
    border-color: hsl(145 52% 40% / 0.95);
    background:
      linear-gradient(135deg, hsl(145 42% 25%), hsl(152 50% 20%));
    box-shadow:
      inset 0 1px 0 hsl(142 42% 65% / 0.2),
      0 0 0 1px hsl(145 57% 30% / 0.4);
  }

  button:focus {
    outline: none;
  }

  button:focus-visible {
    border-color: hsl(144 53% 48% / 0.95);
    box-shadow: 0 0 0 2px hsl(144 58% 48% / 0.2);
  }

  @media (prefers-reduced-motion: reduce) {
    button {
      transition-duration: 1ms;
    }
  }
</style>
