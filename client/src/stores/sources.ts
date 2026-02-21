import { writable } from "svelte/store";

export default function fetchSources() {
  const loadingSources = writable(false);
  const sources = writable<string[]>([]);

  async function get() {
    loadingSources.set(true);
    try {
      const response = await fetch("/sources");
      if (!response.ok) {
        throw new Error(`Sources request failed: ${response.status}`);
      }
      const data: string[] = await response.json();
      sources.set(data);
    } catch {
      sources.set([]);
    } finally {
      loadingSources.set(false);
    }
  }

  get();

  return { sources, loadingSources };
}
