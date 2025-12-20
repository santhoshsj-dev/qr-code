// src/lib/theme.ts
export type ThemeChoice = "light" | "dark";
const THEME_KEY = "theme-preference";

export function getStoredTheme(): ThemeChoice | null {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return (raw === "light" || raw === "dark") ? (raw as ThemeChoice) : null;
  } catch {
    return null;
  }
}

export function getSystemTheme(): ThemeChoice {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getPreferredTheme(): ThemeChoice {
  const stored = getStoredTheme();
  return stored ?? getSystemTheme();
}

export function applyTheme(theme: ThemeChoice) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function persistTheme(theme: ThemeChoice) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

export function toggleTheme(): ThemeChoice {
  const current = getPreferredTheme();
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  persistTheme(next);
  return next;
}

// React hook to access and toggle theme
import { useEffect, useState } from "react";

export function useTheme(): [ThemeChoice, () => ThemeChoice] {
  const [theme, setTheme] = useState<ThemeChoice>(() => getPreferredTheme());

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const handler = () => {
      // if user has not set a stored preference, respond to system changes
      if (!getStoredTheme()) setTheme(getSystemTheme());
    };
    if (mql && mql.addEventListener) mql.addEventListener("change", handler);
    return () => {
      if (mql && mql.removeEventListener) mql.removeEventListener("change", handler);
    };
  }, [theme]);

  const toggle = () => {
    const next = toggleTheme();
    setTheme(next);
    return next;
  };

  // initialize document to current theme on first client render
  useEffect(() => {
    applyTheme(theme);
  }, []);

  return [theme, toggle];
}
