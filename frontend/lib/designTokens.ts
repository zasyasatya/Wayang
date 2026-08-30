/**
 * Design tokens — mencerminkan CSS custom properties di app/globals.css
 * (tema "Mondays" dashboard). Dipakai untuk nilai yang dibutuhkan di JS.
 */
export const colors = {
  bg: "#f6f8fb",
  bgAlt: "#eef2f7",
  surface: "#ffffff",
  surfaceMuted: "#f8fafc",
  border: "#eceff3",
  borderStrong: "#e2e8f0",
  text: "#0f172a",
  textMuted: "#64748b",
  textSoft: "#94a3b8",
  accent: "#2563eb",
  accentHover: "#1d4ed8",
  accentSoft: "#eff4ff",
  success: "#16a34a",
  successSoft: "#e7f6ec",
  pending: "#9333ea",
  pendingSoft: "#f5e9ff",
  danger: "#c026d3",
  dangerSoft: "#fae8ff",
} as const;

export const radius = {
  sm: "0.6rem",
  md: "0.9rem",
  lg: "1.15rem",
  xl: "1.5rem",
  full: "999px",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(15,23,42,0.04), 0 1px 4px rgba(15,23,42,0.05)",
  md: "0 4px 16px -4px rgba(15,23,42,0.08)",
  lg: "0 12px 36px -8px rgba(15,23,42,0.14)",
} as const;
