function getUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export type CircularBufferItem<ItemType> = { id: string; item: ItemType };

export class CircularBuffer<ItemType> {
  length: number;
  items: CircularBufferItem<ItemType>[] = [];
  lastPosition = -1;

  constructor(length: number) {
    this.length = Math.max(0, Math.floor(length));
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
    const normalizedLength = Math.max(0, Math.floor(newLength));

    if (normalizedLength > 0) {
      this.items = this.toArray().slice(0, normalizedLength);
      this.lastPosition = this.items.length - 1;
      this.length = normalizedLength;
      return;
    }

    this.items = [];
    this.lastPosition = -1;
    this.length = 0;
  }
}
