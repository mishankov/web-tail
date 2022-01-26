import { writable } from "svelte/store";


const storedLogWindow = localStorage.getItem("WebTailLogWindow");

export const logWindow = writable(storedLogWindow || "10")

logWindow.subscribe((value) => localStorage.setItem("WebTailLogWindow", value));
