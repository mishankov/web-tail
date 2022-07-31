import { writable } from "svelte/store";

export default function () {
  const loadingSources = writable(false);
  const sources = writable([]);

  async function get() {
    loadingSources.set(true);
    const response = await fetch("/sources");
    const data: Array<string> = await response.json();
    sources.set(data);
    loadingSources.set(false);
  }

  get();

  return { sources, loadingSources };
}
