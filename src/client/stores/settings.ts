import { writable } from "svelte/store";

interface Settings {
  filterLogs: boolean;
  regexFilter: boolean;
  caseSensitive: boolean;
  reverseLogs: boolean;
  logWindow: number;
}

const defaultSettings: Settings = {
  filterLogs: false,
  regexFilter: false,
  caseSensitive: false,
  reverseLogs: false,
  logWindow: 100,
};

function getSettingsFromStorage(): Settings {
  let settings = JSON.parse(localStorage.getItem("WebTailSettings"));
  if (settings === null) {
    localStorage.setItem("WebTailSettings", JSON.stringify(defaultSettings));
    return getSettingsFromStorage();
  } else {
    return settings;
  }
}

function saveSettingsToStorage(name: string, value: number | boolean) {
  const settings = getSettingsFromStorage();
  settings[name] = value;
  localStorage.setItem("WebTailSettings", JSON.stringify(settings));
}

const settingsFromStorage = getSettingsFromStorage();

export const filterLogs = writable(settingsFromStorage.filterLogs);
filterLogs.subscribe((value) => saveSettingsToStorage("filterLogs", value));

export const regexFilter = writable(settingsFromStorage.regexFilter);
regexFilter.subscribe((value) => saveSettingsToStorage("regexFilter", value));

export const caseSensitive = writable(settingsFromStorage.caseSensitive);
caseSensitive.subscribe((value) =>
  saveSettingsToStorage("caseSensitive", value)
);

export const reverseLogs = writable(settingsFromStorage.reverseLogs);
reverseLogs.subscribe((value) => saveSettingsToStorage("reverseLogs", value));

export const logWindow = writable(settingsFromStorage.logWindow);
logWindow.subscribe((value) => saveSettingsToStorage("logWindow", value));
