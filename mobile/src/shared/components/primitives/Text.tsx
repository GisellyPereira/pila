import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";
import { type, type TypeVariant } from "@/src/shared/theme/tokens";
import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
type Tone =
  | "primary"
  | "secondary"
  | "muted"
  | "inverse"
  | "accent"
  | "danger"
  | "success";
type Props = Omit<RNTextProps, "style"> & {
  variant?: TypeVariant;
  tone?: Tone;
  style?: TextStyle | TextStyle[];
  translatable?: boolean;
};
export function Text({
  variant = "bodyM",
  tone = "primary",
  style,
  children,
  translatable = true,
  ...rest
}: Props) {
  const { color, scale, t } = usePreferences();
  const tones = {
    primary: color.text.primary,
    secondary: color.text.secondary,
    muted: color.text.muted,
    inverse: color.text.inverse,
    accent: color.text.accent,
    danger: color.state.danger,
    success: color.state.success,
  };
  const merged: TextStyle = {
    ...(type[variant] as TextStyle),
    color: tones[tone],
    ...StyleSheet.flatten(style),
  };
  const content = (value: React.ReactNode): React.ReactNode =>
    typeof value === "string" && translatable
      ? t(value)
      : Array.isArray(value)
        ? value.map(content)
        : value;
  return (
    <RNText
      {...rest}
      style={[
        merged,
        {
          fontSize: (merged.fontSize ?? type[variant].fontSize) * scale,
          lineHeight: (merged.lineHeight ?? type[variant].lineHeight) * scale,
        },
      ]}
    >
      {content(children)}
    </RNText>
  );
}
