import { writable } from "svelte/store";
import {
  CircularBuffer,
  type CircularBufferItem,
} from "../types/CircularBuffer";

export const logs = writable(new CircularBuffer<string>(20));
export const filteredLogs = writable<CircularBufferItem<string>[]>([]);
