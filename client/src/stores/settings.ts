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

function normalizeSettings(value: unknown): Settings {
  if (typeof value !== "object" || value === null) {
    return defaultSettings;
  }

  const partial = value as Partial<Settings>;
  return {
    filterLogs: typeof partial.filterLogs === "boolean" ? partial.filterLogs : defaultSettings.filterLogs,
    regexFilter: typeof partial.regexFilter === "boolean" ? partial.regexFilter : defaultSettings.regexFilter,
    caseSensitive: typeof partial.caseSensitive === "boolean" ? partial.caseSensitive : defaultSettings.caseSensitive,
    reverseLogs: typeof partial.reverseLogs === "boolean" ? partial.reverseLogs : defaultSettings.reverseLogs,
    logWindow: typeof partial.logWindow === "number" ? partial.logWindow : defaultSettings.logWindow,
  };
}

function getSettingsFromStorage(): Settings {
  const rawSettings = localStorage.getItem("WebTailSettings");
  if (!rawSettings) {
    localStorage.setItem("WebTailSettings", JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  try {
    return normalizeSettings(JSON.parse(rawSettings));
  } catch {
    localStorage.setItem("WebTailSettings", JSON.stringify(defaultSettings));
    return defaultSettings;
  }
}

function saveSettingsToStorage<K extends keyof Settings>(
  name: K,
  value: Settings[K]
) {
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
