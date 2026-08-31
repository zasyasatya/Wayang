"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_THEME,
  THEME_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  THEMES,
  type ThemeId,
  type ThemeMode,
} from "@/lib/themes";

interface ThemeContextValue {
  /** Tema warna terpilih (kunci data-theme). */
  theme: ThemeId;
  /** Pilihan mode yang disimpan user: auto | light | dark. */
  mode: ThemeMode;
  /** Mode yang benar-benar berlaku (hasil resolusi "auto"). */
  effectiveMode: "light" | "dark";
  /** true setelah state tersinkron dengan localStorage (aman dirender di UI). */
  ready: boolean;
  setTheme: (id: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(key: string, valid: string[]): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(key);
    return v && valid.includes(v) ? v : null;
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* privasi mode — abaikan */
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // State awal selalu default agar hydration konsisten dengan SSR;
  // nilai tersimpan dibaca setelah mount (script di layout.tsx sudah
  // menerapkan atribut ke <html> sebelum render pertama).
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [mode, setModeState] = useState<ThemeMode>("auto");
  const [systemDark, setSystemDark] = useState(false);
  const [ready, setReady] = useState(false);

  // Ikuti preferensi gelap sistem saat mode "auto".
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Sinkronkan state dari localStorage sekali setelah mount.
  useEffect(() => {
    const t = readStored(THEME_STORAGE_KEY, THEMES.map((x) => x.id));
    const m = readStored(THEME_MODE_STORAGE_KEY, ["auto", "light", "dark"]);
    if (t) setThemeState(t as ThemeId);
    if (m) setModeState(m as ThemeMode);
    setReady(true);
  }, []);

  const effectiveMode: "light" | "dark" =
    mode === "dark" || (mode === "auto" && systemDark) ? "dark" : "light";

  // Terapkan ke <html> (dibaca oleh globals.css).
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-theme-mode", effectiveMode);
  }, [theme, effectiveMode]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    writeStored(THEME_STORAGE_KEY, id);
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    writeStored(THEME_MODE_STORAGE_KEY, m);
  }, []);

  const value = useMemo(
    () => ({ theme, mode, effectiveMode, ready, setTheme, setMode }),
    [theme, mode, effectiveMode, ready, setTheme, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme harus dipakai di dalam <ThemeProvider>.");
  return ctx;
}
