export class CircularBuffer<ItemType> {
    length: number;
    items: Array<ItemType> = [];
    lastPosition = -1;

    constructor(length: number) {
        this.length = length;
    }

    push(item: ItemType) {
        this.lastPosition = (this.lastPosition + 1) % this.length;

        if (this.items.length === this.length) {
            this.items[this.lastPosition] = item;
        } else {
            this.items.push(item);
        }
    }

    toArray(): Array<ItemType> {
        if (this.lastPosition === this.items.length - 1) {
            return this.items;
        } else {
            return this.items.map((_, position, array) => array[(position + this.lastPosition + 1) % this.length]);
        }
    }

    setLength(newLength: number) {
        if (newLength > 0) {
            this.items = this.toArray();
            this.lastPosition = this.items.length - 1;
            this.length = newLength;
        } else {
            this.items = [];
            this.lastPosition = -1;
            this.length = 0;
        }
    }
}
