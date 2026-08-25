"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<Ctx | null>(null);

function writeCookie(value: Theme) {
  // 1 year, root path
  document.cookie = `theme=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

function readDomTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // null until we've read what the inline bootstrap put on <html>. The server
  // always renders the light theme so the page can stay static; the bootstrap
  // script fixes the attribute before first paint, and we adopt its value here
  // instead of overwriting it — writing on mount would flash light-then-dark.
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    setThemeState(readDomTheme());
  }, []);

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    writeCookie(t);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = (prev ?? readDomTheme()) === "dark" ? "light" : "dark";
      writeCookie(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: theme ?? "light", setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
