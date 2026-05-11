import {
  Pressable,
  type PressableProps,
  View,
  type ViewStyle,
} from "react-native";

import { color, radius, shadow, space } from "@/src/shared/theme/tokens";

type Tone = "surface" | "elevated" | "outline" | "highlight";

type Props = {
  children: React.ReactNode;
  tone?: Tone;
  padding?: keyof typeof space | "none";
  style?: ViewStyle;
  onPress?: PressableProps["onPress"];
};

const PADDING_MAP = {
  none: 0,
  ...space,
} as const;

function toneStyle(tone: Tone): ViewStyle {
  switch (tone) {
    case "elevated":
      return {
        backgroundColor: color.bg.surfaceElevated,
        ...shadow.card,
      };
    case "outline":
      return {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: color.border.subtle,
      };
    case "highlight":
      return {
        backgroundColor: color.brand.pila,
      };
    case "surface":
    default:
      return {
        backgroundColor: color.bg.surface,
        ...shadow.card,
      };
  }
}

export function Card({
  children,
  tone = "surface",
  padding = "lg",
  style,
  onPress,
}: Props) {
  const baseStyle: ViewStyle = {
    borderRadius: radius.xl,
    padding: PADDING_MAP[padding],
    ...toneStyle(tone),
    ...style,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          baseStyle,
          { transform: pressed ? [{ scale: 0.99 }] : undefined, opacity: pressed ? 0.95 : 1 },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={baseStyle}>{children}</View>;
}
