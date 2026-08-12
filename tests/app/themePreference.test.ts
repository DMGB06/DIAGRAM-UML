import { beforeEach, describe, expect, it } from "vitest";

import {
  loadThemePreference,
  saveThemePreference,
  THEME_STORAGE_KEY,
} from "../../src/app/themePreference";

if (typeof globalThis.localStorage === "undefined") {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

describe("themePreference", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing is stored", () => {
    expect(loadThemePreference()).toBeNull();
  });

  it("persists and reloads an explicit dark preference", () => {
    saveThemePreference("dark");
    expect(loadThemePreference()).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("persists and reloads an explicit light preference", () => {
    saveThemePreference("light");
    expect(loadThemePreference()).toBe("light");
  });

  it("clears the stored preference when set back to null (follow system)", () => {
    saveThemePreference("dark");
    saveThemePreference(null);
    expect(loadThemePreference()).toBeNull();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});
