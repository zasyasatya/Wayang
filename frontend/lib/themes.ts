/**
 * Definisi tema warna & mode terang/gelap.
 *
 * Nilai warna aslinya ada di `app/globals.css` (CSS custom properties);
 * file ini hanya mendeskripsikan tema untuk UI pemilih tema dan sebagai
 * sumber nama kunci (`data-theme`) yang konsisten.
 */

export type ThemeId = "kamasan" | "samudra" | "alas" | "senja";

export type ThemeMode = "auto" | "light" | "dark";

export interface ThemeDef {
  id: ThemeId;
  name: string;
  description: string;
  /** Warna aksen representatif untuk preview di pemilih tema. */
  swatch: string;
}

export const THEMES: ThemeDef[] = [
  {
    id: "kamasan",
    name: "Kamasan",
    description: "Terra cotta lukisan Kamasan — nuansa klasik Bali (default).",
    swatch: "#a8431f",
  },
  {
    id: "samudra",
    name: "Samudra",
    description: "Tehali laut di pesisir, tenang dan dalam.",
    swatch: "#0e6e68",
  },
  {
    id: "alas",
    name: "Alas",
    description: "Hijau tua hutan dan sawah di Bali.",
    swatch: "#4a6d2c",
  },
  {
    id: "senja",
    name: "Senja",
    description: "Ambar keemasan matahari terbenam di atas lereng.",
    swatch: "#b45309",
  },
];

export const DEFAULT_THEME: ThemeId = "kamasan";

export const THEME_MODES: { id: ThemeMode; label: string; hint: string }[] = [
  { id: "auto", label: "Sistem", hint: "Ikuti preferensi perangkat" },
  { id: "light", label: "Terang", hint: "Selalu mode terang" },
  { id: "dark", label: "Gelap", hint: "Selalu mode gelap" },
];

export function themeById(id: string): ThemeDef | undefined {
  return THEMES.find((t) => t.id === id);
}

/** Kunci penyimpanan di localStorage. */
export const THEME_STORAGE_KEY = "wayang.theme";
export const THEME_MODE_STORAGE_KEY = "wayang.themeMode";
