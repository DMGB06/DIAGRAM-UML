export const THEME_STORAGE_KEY = "uml-visual-studio:theme";

export type ThemePreference = "light" | "dark" | null;

export function loadThemePreference(): ThemePreference {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(THEME_STORAGE_KEY);
  return raw === "light" || raw === "dark" ? raw : null;
}

export function saveThemePreference(theme: ThemePreference) {
  if (typeof localStorage === "undefined") {
    return;
  }

  if (theme === null) {
    localStorage.removeItem(THEME_STORAGE_KEY);
    return;
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
