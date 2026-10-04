import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { color as lightColors } from "@/src/shared/theme/tokens";
import { translate } from "./translations";
export type ThemeChoice = "light" | "dark" | "system";
export type Language = "pt-BR" | "en-US";
export type TextSize = "normal" | "large" | "extra";
export type ThemeColors = {
  [K in keyof typeof lightColors]: {
    [P in keyof (typeof lightColors)[K]]: string;
  };
};
const darkColors: ThemeColors = {
  navigation: { background: "#1A0088", text: "#EFE7D4" },
  hero: { background: "#1A0088", text: "#EFE7D4", muted: "#EFE7D4" },
  feature: {
    blueSurface: "#251D42",
    blueInk: "#EFE7D4",
    blueStrong: "#1A0088",
    blueText: "#EFE7D4",
    blueMuted: "#EFE7D4",
    roseSurface: "#4C241D",
    roseInk: "#FF9B7D",
    roseStrong: "#FF5E32",
    roseText: "#1A0088",
    roseMuted: "#1A0088",
    slateSurface: "#343C1D",
    slateInk: "#B8CE4F",
    slateStrong: "#B8CE4F",
    slateText: "#1A0088",
    slateMuted: "#1A0088",
  },
  chart: {
    purple: "#B8CE4F",
    pink: "#FF9B7D",
    blue: "#BBAAF5",
    lilac: "#9D8ACB",
    slate: "#EFE7D4",
  },
  action: {
    primary: "#B8CE4F",
    pressed: "#A6BA46",
    text: "#1A0088",
    danger: "#FF5E32",
    dangerText: "#1A0088",
  },
  bg: {
    app: "#100B25",
    surface: "#21183D",
    surfaceElevated: "#30244F",
    overlay: "rgba(16,11,37,0.7)",
  },
  text: {
    primary: "#EFE7D4",
    secondary: "#D9D0E6",
    muted: "#C3B7D6",
    inverse: "#1A0088",
    accent: "#B8CE4F",
  },
  brand: { pila: "#B8CE4F", noite: "#1A0088" },
  accent: {
    coral: "#FF9B7D",
    menta: "#B8CE4F",
    laranja: "#B8CE4F",
    creme: "#21183D",
    carrasco: "#FF9B7D",
  },
  state: {
    success: "#B8CE4F",
    warning: "#B8CE4F",
    danger: "#FF9B7D",
    info: "#EFE7D4",
  },
  border: {
    subtle: "rgba(239,231,212,0.12)",
    strong: "rgba(239,231,212,0.28)",
  },
};
type Preferences = {
  theme: ThemeChoice;
  language: Language;
  textSize: TextSize;
};
const defaults: Preferences = {
  theme: "light",
  language: "pt-BR",
  textSize: "normal",
};
const KEY = "pila:preferences:v1";
type Value = Preferences & {
  color: ThemeColors;
  dark: boolean;
  scale: number;
  ready: boolean;
  error: boolean;
  setTheme: (v: ThemeChoice) => void;
  setLanguage: (v: Language) => void;
  setTextSize: (v: TextSize) => void;
  t: (text: string) => string;
};
const Context = createContext<Value | null>(null);
export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const scheme = useColorScheme();
  const [preferences, setPreferences] = useState(defaults);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const writable = useRef(true);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!alive || !raw) return;
        const p = JSON.parse(raw) as Preferences;
        if (
          !["light", "dark", "system"].includes(p.theme) ||
          !["pt-BR", "en-US"].includes(p.language) ||
          !["normal", "large", "extra"].includes(p.textSize)
        )
          throw new Error("Invalid preferences");
        setPreferences(p);
      })
      .catch(() => {
        writable.current = false;
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (!ready || !writable.current) return;
    queue.current = queue.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(KEY, JSON.stringify(preferences)))
      .then(() => setError(false))
      .catch(() => setError(true));
  }, [preferences, ready]);
  const dark =
    preferences.theme === "dark" ||
    (preferences.theme === "system" && scheme === "dark");
  const update = (change: Partial<Preferences>) =>
    setPreferences((p) => ({ ...p, ...change }));
  return (
    <Context.Provider
      value={{
        ...preferences,
        ready,
        error,
        dark,
        color: dark ? darkColors : lightColors,
        scale:
          preferences.textSize === "extra"
            ? 1.24
            : preferences.textSize === "large"
              ? 1.12
              : 1,
        setTheme: (theme) => update({ theme }),
        setLanguage: (language) => update({ language }),
        setTextSize: (textSize) => update({ textSize }),
        t: (text) => translate(text, preferences.language),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePreferences() {
  const value = useContext(Context);
  if (!value) throw new Error("PreferencesProvider is missing");
  return value;
}
