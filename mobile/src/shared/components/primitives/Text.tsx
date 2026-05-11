import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";

import { color, type, type TypeVariant } from "@/src/shared/theme/tokens";

type Tone = "primary" | "secondary" | "muted" | "inverse" | "accent" | "danger" | "success";

type Props = Omit<RNTextProps, "style"> & {
  variant?: TypeVariant;
  tone?: Tone;
  style?: TextStyle | TextStyle[];
};

const TONE_MAP: Record<Tone, string> = {
  primary: color.text.primary,
  secondary: color.text.secondary,
  muted: color.text.muted,
  inverse: color.text.inverse,
  accent: color.text.accent,
  danger: color.state.danger,
  success: color.state.success,
};

export function Text({
  variant = "bodyM",
  tone = "primary",
  style,
  children,
  ...rest
}: Props) {
  return (
    <RNText
      {...rest}
      style={[
        type[variant] as TextStyle,
        { color: TONE_MAP[tone] },
        style as TextStyle,
      ]}
    >
      {children}
    </RNText>
  );
}
