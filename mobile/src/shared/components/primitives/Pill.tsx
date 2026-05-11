import { View, type ViewStyle } from "react-native";

import { color, radius, space, type as typo } from "@/src/shared/theme/tokens";

import { Text } from "./Text";

type Tone = "pila" | "menta" | "coral" | "laranja" | "neutral";
type Size = "md" | "sm";

type Props = {
  label: string;
  tone?: Tone;
  size?: Size;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
};

const TONE_BG: Record<Tone, string> = {
  pila: color.brand.pila,
  menta: color.accent.menta,
  coral: color.accent.coral,
  laranja: color.accent.laranja,
  neutral: color.border.strong,
};

const TONE_TEXT: Record<Tone, "inverse" | "primary"> = {
  pila: "inverse",
  menta: "inverse",
  coral: "inverse",
  laranja: "inverse",
  neutral: "primary",
};

export function Pill({ label, tone = "pila", size = "md", leftIcon, style }: Props) {
  const isSm = size === "sm";
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: space.xs,
          backgroundColor: TONE_BG[tone],
          paddingHorizontal: isSm ? space.sm : space.md,
          paddingVertical: isSm ? 2 : 4,
          borderRadius: radius.pill,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      {leftIcon}
      <Text
        variant="labelCaps"
        tone={TONE_TEXT[tone]}
        style={{ ...typo.labelCaps, fontSize: isSm ? 10 : 11 }}
      >
        {label}
      </Text>
    </View>
  );
}
