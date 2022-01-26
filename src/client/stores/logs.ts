import { writable } from "svelte/store";
import { CircularBuffer }from "../types/CircularBuffer";

export const logs = writable(new CircularBuffer<string>(20));
