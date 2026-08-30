/**
 * Design tokens — mencerminkan CSS custom properties di app/globals.css.
 * Digunakan untuk nilai yang perlu dipakai dalam JS (mis. warna kanvas, dll).
 */
export const colors = {
  bg: "#fdf9f1",
  bgAlt: "#faf3e6",
  surface: "#ffffff",
  surfaceMuted: "#f7efe1",
  border: "#e8dcc6",
  borderStrong: "#d8c6a6",
  text: "#2a2019",
  textMuted: "#6b5b4a",
  textSoft: "#8a7a68",
  accent: "#c9942f",
  accentHover: "#a97a24",
  accentSoft: "#f6e7c6",
  danger: "#b03a2e",
  dangerSoft: "#f8e4e0",
  success: "#2f8f78",
  cocoa800: "#372316",
  cream50: "#fdf9f1",
  cream100: "#faf3e6",
  ember500: "#d9764a",
} as const;

export const radius = {
  sm: "0.5rem",
  md: "0.875rem",
  lg: "1.375rem",
  xl: "2rem",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(36,21,9,0.06), 0 1px 3px rgba(36,21,9,0.04)",
  md: "0 4px 14px -2px rgba(36,21,9,0.12)",
  lg: "0 14px 34px -8px rgba(36,21,9,0.18)",
} as const;
