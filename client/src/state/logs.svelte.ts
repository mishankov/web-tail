import {
  CircularBuffer,
  DEFAULT_LOG_WINDOW_SIZE,
  type CircularBufferItem,
} from "../types/CircularBuffer";

let buffer = new CircularBuffer<string>(DEFAULT_LOG_WINDOW_SIZE);

export const logsState = $state({
  all: buffer.toArray() as CircularBufferItem<string>[],
  filtered: [] as CircularBufferItem<string>[],
});

function refreshAllLogs(): void {
  logsState.all = buffer.toArray();
}

export function resetLogs(windowSize: number): void {
  buffer = new CircularBuffer<string>(windowSize);
  refreshAllLogs();
  logsState.filtered = [];
}

export function appendLogChunk(chunk: string): void {
  if (chunk.length === 0) {
    return;
  }

  let didAppend = false;
  for (const line of chunk.split("\n")) {
    if (line.length > 0) {
      buffer.push(line);
      didAppend = true;
    }
  }

  if (didAppend) {
    refreshAllLogs();
  }
}

export function resizeLogWindow(windowSize: number): void {
  buffer.setLength(windowSize);
  refreshAllLogs();
}

export function setFilteredLogs(next: CircularBufferItem<string>[]): void {
  logsState.filtered = next;
}
