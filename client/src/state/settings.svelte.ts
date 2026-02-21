export interface Settings {
  filterLogs: boolean;
  regexFilter: boolean;
  caseSensitive: boolean;
  reverseLogs: boolean;
  logWindow: number;
}

const STORAGE_KEY = "WebTailSettings";

const defaultSettings: Settings = {
  filterLogs: false,
  regexFilter: false,
  caseSensitive: false,
  reverseLogs: false,
  logWindow: 100,
};

function normalizeSettings(value: unknown): Settings {
  if (typeof value !== "object" || value === null) {
    return { ...defaultSettings };
  }

  const partial = value as Partial<Settings>;
  return {
    filterLogs:
      typeof partial.filterLogs === "boolean"
        ? partial.filterLogs
        : defaultSettings.filterLogs,
    regexFilter:
      typeof partial.regexFilter === "boolean"
        ? partial.regexFilter
        : defaultSettings.regexFilter,
    caseSensitive:
      typeof partial.caseSensitive === "boolean"
        ? partial.caseSensitive
        : defaultSettings.caseSensitive,
    reverseLogs:
      typeof partial.reverseLogs === "boolean"
        ? partial.reverseLogs
        : defaultSettings.reverseLogs,
    logWindow:
      typeof partial.logWindow === "number"
        ? partial.logWindow
        : defaultSettings.logWindow,
  };
}

function currentSettingsSnapshot(): Settings {
  return {
    filterLogs: settingsState.filterLogs,
    regexFilter: settingsState.regexFilter,
    caseSensitive: settingsState.caseSensitive,
    reverseLogs: settingsState.reverseLogs,
    logWindow: settingsState.logWindow,
  };
}

function saveSettingsToStorage(settings: Settings): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function loadSettings(): Settings {
  if (typeof localStorage === "undefined") {
    return { ...defaultSettings };
  }

  const rawSettings = localStorage.getItem(STORAGE_KEY);
  if (!rawSettings) {
    const settings = { ...defaultSettings };
    saveSettingsToStorage(settings);
    return settings;
  }

  try {
    const settings = normalizeSettings(JSON.parse(rawSettings));
    saveSettingsToStorage(settings);
    return settings;
  } catch {
    const settings = { ...defaultSettings };
    saveSettingsToStorage(settings);
    return settings;
  }
}

export const settingsState = $state<Settings>(loadSettings());

export function setSetting<K extends keyof Settings>(
  key: K,
  value: Settings[K]
): void {
  settingsState[key] = value;
  saveSettingsToStorage(currentSettingsSnapshot());
}
