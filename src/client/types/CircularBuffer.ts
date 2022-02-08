import { get_uuid } from "web-tail-wasm";

function getUniqueId() {
  return get_uuid();
}

export class CircularBuffer<ItemType> {
  length: number;
  items: Array<{ id: string; item: ItemType }> = [];
  lastPosition = -1;

  constructor(length: number) {
    this.length = length;
  }

  push(item: ItemType) {
    this.lastPosition = (this.lastPosition + 1) % this.length;

    if (this.items.length === this.length) {
      this.items[this.lastPosition].item = item;
    } else {
      this.items.push({ id: getUniqueId(), item: item });
    }
  }

  toArray(): Array<{ id: string; item: ItemType }> {
    if (this.lastPosition === this.items.length - 1) {
      return this.items;
    } else {
      return this.items.map(
        (_, position, array) =>
          array[(position + this.lastPosition + 1) % this.length]
      );
    }
  }

  setLength(newLength: number) {
    if (newLength > 0) {
      this.items = this.toArray().slice(0, newLength);
      this.lastPosition = this.items.length - 1;
      this.length = newLength;
    } else {
      this.items = [];
      this.lastPosition = -1;
      this.length = 0;
    }
  }
}
