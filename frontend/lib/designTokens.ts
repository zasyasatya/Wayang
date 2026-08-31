/**
 * Design tokens — mencerminkan CSS custom properties di app/globals.css
 * (tema default "Kamasan", mode terang). Dipakai untuk nilai yang
 * dibutuhkan di JS. Nilai lain (termasuk mode gelap & tema lainnya)
 * selalu diambil dari CSS variables agar tetap selaras.
 */
export const colors = {
  bg: "#f6f3ee",
  bgAlt: "#efeae2",
  surface: "#fffdfa",
  surfaceMuted: "#f3efe8",
  border: "#e7e1d6",
  borderStrong: "#d7cfc0",
  text: "#262019",
  textMuted: "#6d6459",
  textSoft: "#9a8f81",
  accent: "#a8431f",
  accentHover: "#8a3418",
  accentSoft: "#f5e8e0",
  success: "#2e7d4f",
  successSoft: "#e2efe6",
  pending: "#8a6a1c",
  pendingSoft: "#f4ecd6",
  danger: "#a02c2c",
  dangerSoft: "#f6e4e1",
} as const;

export const radius = {
  sm: "0.6rem",
  md: "0.9rem",
  lg: "1.15rem",
  xl: "1.5rem",
  full: "999px",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(38,32,25,0.05), 0 1px 4px rgba(38,32,25,0.06)",
  md: "0 4px 16px -4px rgba(38,32,25,0.10)",
  lg: "0 12px 36px -8px rgba(38,32,25,0.18)",
} as const;
