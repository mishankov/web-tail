function getUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export type CircularBufferItem<ItemType> = { id: string; item: ItemType };

export const DEFAULT_LOG_WINDOW_SIZE = 100;
export const MIN_LOG_WINDOW_SIZE = 1;
export const MAX_LOG_WINDOW_SIZE = 10000;

function normalizeWindowSize(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_LOG_WINDOW_SIZE;
  }

  const integer = Math.floor(value);
  return Math.min(MAX_LOG_WINDOW_SIZE, Math.max(MIN_LOG_WINDOW_SIZE, integer));
}

export class CircularBuffer<ItemType> {
  length: number;
  items: CircularBufferItem<ItemType>[] = [];
  lastPosition = -1;

  constructor(length: number) {
    this.length = normalizeWindowSize(length);
  }

  push(item: ItemType): void {
    if (this.length <= 0) {
      return;
    }

    this.lastPosition = (this.lastPosition + 1) % this.length;

    if (this.items.length === this.length) {
      this.items[this.lastPosition].item = item;
      return;
    }

    this.items.push({ id: getUniqueId(), item });
  }

  toArray(): CircularBufferItem<ItemType>[] {
    if (this.items.length === 0 || this.length === 0) {
      return [];
    }

    if (this.lastPosition === this.items.length - 1) {
      return [...this.items];
    }

    return this.items.map(
      (_, position, array) =>
        array[(position + this.lastPosition + 1) % this.items.length],
    );
  }

  setLength(newLength: number): void {
    const normalizedLength = normalizeWindowSize(newLength);
    this.items = this.toArray().slice(0, normalizedLength);
    this.lastPosition = this.items.length - 1;
    this.length = normalizedLength;
  }
}
