export const sourcesState = $state({
  items: [] as string[],
  loading: false,
});

let hasLoaded = false;

function normalizeSources(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((source): source is string => typeof source === "string");
}

export async function loadSources(force = false): Promise<void> {
  if (sourcesState.loading) {
    return;
  }

  if (hasLoaded && !force) {
    return;
  }

  sourcesState.loading = true;
  try {
    const response = await fetch("/sources");
    if (!response.ok) {
      throw new Error(`Sources request failed: ${response.status}`);
    }

    const data = normalizeSources(await response.json());
    sourcesState.items = data;
    hasLoaded = true;
  } catch {
    sourcesState.items = [];
  } finally {
    sourcesState.loading = false;
  }
}
