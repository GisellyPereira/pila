/** Pila: paleta escolhida pela Giselly — eggshell, yellow green, tiger flame e ultramarine. */
export const palette = {
  pila: "#B8CE4F",
  noite: "#1A0088",
  noiteFundo: "#EFE7D4",
  noiteElevado: "#E2DAC8",
  coral: "#FF5E32",
  menta: "#1A0088",
  laranja: "#B8CE4F",
  creme: "#EFE7D4",
  carrasco: "#A32919",
} as const;
export const color = {
  navigation: { background: "#1A0088", text: "#EFE7D4" },
  hero: { background: "#1A0088", text: "#EFE7D4", muted: "#EFE7D4" },
  feature: {
    blueSurface: "#EFE7D4",
    blueInk: "#1A0088",
    blueStrong: "#1A0088",
    blueText: "#EFE7D4",
    blueMuted: "#EFE7D4",
    roseSurface: "#FF5E32",
    roseInk: "#1A0088",
    roseStrong: "#FF5E32",
    roseText: "#1A0088",
    roseMuted: "#1A0088",
    slateSurface: "#B8CE4F",
    slateInk: "#1A0088",
    slateStrong: "#B8CE4F",
    slateText: "#1A0088",
    slateMuted: "#1A0088",
  },
  chart: {
    purple: "#1A0088",
    pink: "#FF5E32",
    blue: "#362297",
    lilac: "#6957A8",
    slate: "#B8CE4F",
  },
  action: {
    primary: "#1A0088",
    pressed: "#120060",
    text: "#EFE7D4",
    danger: "#FF5E32",
    dangerText: "#1A0088",
  },
  bg: {
    app: palette.noiteFundo,
    surface: palette.creme,
    surfaceElevated: palette.noiteElevado,
    overlay: "rgba(16,11,37,0.65)",
  },
  text: {
    primary: "#1A0088",
    secondary: "#1A0088",
    muted: "#1A0088",
    inverse: "#EFE7D4",
    accent: "#1A0088",
  },
  brand: { pila: palette.pila, noite: palette.noite },
  accent: {
    coral: palette.coral,
    menta: palette.menta,
    laranja: palette.laranja,
    creme: palette.creme,
    carrasco: palette.carrasco,
  },
  state: {
    success: "#1A0088",
    warning: "#1A0088",
    danger: "#A32919",
    info: "#1A0088",
  },
  border: { subtle: "rgba(26,0,136,0.12)", strong: "rgba(26,0,136,0.30)" },
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
  display: "Inter_700Bold",
  body: "Inter_400Regular",
  bodyBold: "Inter_700Bold",
  hand: "Inter_400Regular",
  handBold: "Inter_700Bold",
} as const;

export const type = {
  displayXL: {
    fontFamily: font.display,
    fontSize: 32,
    lineHeight: 38,
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
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  moneyXL: {
    fontFamily: font.display,
    fontSize: 40,
    lineHeight: 48,
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
    fontSize: 18,
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
    shadowOpacity: 0.03,
    shadowRadius: 14,
    elevation: 0,
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
