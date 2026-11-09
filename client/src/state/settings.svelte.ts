import { DEFAULT_LOG_WINDOW_SIZE } from "../types/CircularBuffer";
import { isThemePreference, type ThemePreference } from "../theme";

export interface Settings {
  theme: ThemePreference;
  filterLogs: boolean;
  regexFilter: boolean;
  caseSensitive: boolean;
  reverseLogs: boolean;
  logWindow: number;
}

const STORAGE_KEY = "WebTailSettings";

const defaultSettings: Settings = {
  theme: "system",
  filterLogs: false,
  regexFilter: false,
  caseSensitive: false,
  reverseLogs: false,
  logWindow: DEFAULT_LOG_WINDOW_SIZE,
};

function normalizeSettings(value: unknown): Settings {
  if (typeof value !== "object" || value === null) {
    return { ...defaultSettings };
  }

  const partial = value as Partial<Settings>;
  return {
    theme: isThemePreference(partial.theme) ? partial.theme : defaultSettings.theme,
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
    theme: settingsState.theme,
    filterLogs: settingsState.filterLogs,
    regexFilter: settingsState.regexFilter,
    caseSensitive: settingsState.caseSensitive,
    reverseLogs: settingsState.reverseLogs,
    logWindow: settingsState.logWindow,
  };
}

function saveSettingsToStorage(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Preferences still work for this session when browser storage is unavailable.
  }
}

export function loadSettings(): Settings {
  try {
    const rawSettings = localStorage.getItem(STORAGE_KEY);
    const settings = rawSettings
      ? normalizeSettings(JSON.parse(rawSettings))
      : { ...defaultSettings };
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
