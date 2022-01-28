import { writable } from "svelte/store";


const storedFilterLogs = localStorage.getItem("WebTailFilterLogs");
export const filterLogs = writable(storedFilterLogs || "false");
filterLogs.subscribe((value) => localStorage.setItem("WebTailFilterLogs", value));

const storedReverseLogs = localStorage.getItem("WebTailReverseLogs");
export const reverseLogs = writable(storedReverseLogs || "false");
reverseLogs.subscribe((value) => localStorage.setItem("WebTailReverseLogs", value));

const storedLogWindow = localStorage.getItem("WebTailLogWindow");
export const logWindow = writable(storedLogWindow || "10");
logWindow.subscribe((value) => localStorage.setItem("WebTailLogWindow", value));
