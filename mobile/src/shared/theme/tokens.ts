/**
 * Tokens do design system PILA — única fonte de verdade.
 * tailwind.config.js importa daqui pra manter NativeWind sincronizado.
 *
 * Display font: o brief sugere Clash Display ou Boogy Brut. Usamos
 * ArchivoBlack porque tem fallback nativo via @expo-google-fonts e
 * mantém o mood chunky/sem-ser-infantil que o brief pede.
 */

export const palette = {
  pila: "#FFD93D",
  noite: "#1A1A2E",
  noiteFundo: "#0F0F1E",
  noiteElevado: "#252540",
  coral: "#FF6B6B",
  menta: "#06D6A0",
  laranja: "#FF9F1C",
  creme: "#F4F1DE",
  carrasco: "#E63946",
} as const;

export const color = {
  bg: {
    app: palette.noiteFundo,
    surface: palette.noite,
    surfaceElevated: palette.noiteElevado,
    overlay: "rgba(0,0,0,0.6)",
  },
  text: {
    primary: palette.creme,
    secondary: "rgba(244,241,222,0.72)",
    muted: "rgba(244,241,222,0.48)",
    inverse: palette.noite,
    accent: palette.pila,
  },
  brand: {
    pila: palette.pila,
    noite: palette.noite,
  },
  accent: {
    coral: palette.coral,
    menta: palette.menta,
    laranja: palette.laranja,
    creme: palette.creme,
    carrasco: palette.carrasco,
  },
  state: {
    success: palette.menta,
    warning: palette.laranja,
    danger: palette.carrasco,
    info: palette.pila,
  },
  border: {
    subtle: "rgba(244,241,222,0.08)",
    strong: "rgba(244,241,222,0.18)",
  },
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
  "4xl": 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  pill: 999,
} as const;

export const font = {
  display: "ArchivoBlack_400Regular",
  body: "Inter_400Regular",
  bodyBold: "Inter_700Bold",
  hand: "Caveat_400Regular",
  handBold: "Caveat_700Bold",
} as const;

export const type = {
  displayXL: {
    fontFamily: font.display,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1.2,
  },
  displayL: {
    fontFamily: font.display,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.8,
  },
  displayM: {
    fontFamily: font.display,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  displayS: {
    fontFamily: font.display,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  bodyL: { fontFamily: font.body, fontSize: 17, lineHeight: 24 },
  bodyM: { fontFamily: font.body, fontSize: 15, lineHeight: 22 },
  bodyS: { fontFamily: font.body, fontSize: 13, lineHeight: 18 },
  bodyBoldM: { fontFamily: font.bodyBold, fontSize: 15, lineHeight: 22 },
  labelCaps: {
    fontFamily: font.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
  },
  moneyXL: {
    fontFamily: font.display,
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -1.8,
    fontVariant: ["tabular-nums" as const],
  },
  moneyL: {
    fontFamily: font.display,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.6,
    fontVariant: ["tabular-nums" as const],
  },
  moneyM: {
    fontFamily: font.display,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.2,
    fontVariant: ["tabular-nums" as const],
  },
  bubble: { fontFamily: font.handBold, fontSize: 22, lineHeight: 26 },
} as const;

export type TypeVariant = keyof typeof type;

export const motion = {
  fast: 150,
  base: 240,
  slow: 400,
} as const;

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  hero: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export const tokens = {
  palette,
  color,
  space,
  radius,
  font,
  type,
  motion,
  shadow,
} as const;

export type Tokens = typeof tokens;
