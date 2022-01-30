import { writable } from "svelte/store";

interface Settings {
  filterLogs: boolean;
  regexFilter: boolean;
  reverseLogs: boolean;
  logWindow: number;
}

const defaultSettings: Settings = {
  filterLogs: false,
  regexFilter: false,
  reverseLogs: false,
  logWindow: 100,
};

function getSettingsFromStorage(): Settings {
  try {
    return JSON.parse(localStorage.getItem("WebTailSettings"));
  } catch {
    localStorage.setItem("WebTailSettings", JSON.stringify(defaultSettings));
    return getSettingsFromStorage();
  }
}

function saveSettingsToStorage(name: string, value: any) {
  const settings = getSettingsFromStorage();
  settings[name] = value;
  localStorage.setItem("WebTailSettings", JSON.stringify(settings));
}

const settingsFromStorage = getSettingsFromStorage();

export const filterLogs = writable(settingsFromStorage.filterLogs);
filterLogs.subscribe((value) => saveSettingsToStorage("filterLogs", value));

export const regexFilter = writable(settingsFromStorage.regexFilter);
regexFilter.subscribe((value) => saveSettingsToStorage("regexFilter", value));

export const reverseLogs = writable(settingsFromStorage.reverseLogs);
reverseLogs.subscribe((value) => saveSettingsToStorage("reverseLogs", value));

export const logWindow = writable(settingsFromStorage.logWindow);
logWindow.subscribe((value) => saveSettingsToStorage("logWindow", value));
