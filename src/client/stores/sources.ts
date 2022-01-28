import { writable } from "svelte/store";

export default function () {
  const loadingSources = writable(false);
  const sources = writable([]);

  async function get() {
    loadingSources.set(true);
    let response = await fetch("/sources");
    let data: Array<string> = await response.json();
    sources.set(data);
    loadingSources.set(false);
  }

  get();

  return { sources, loadingSources };
}
