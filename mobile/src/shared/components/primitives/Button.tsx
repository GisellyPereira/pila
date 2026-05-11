import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  View,
  type ViewStyle,
} from "react-native";

import { useHaptics } from "@/src/shared/hooks/useHaptics";
import { color, radius, space, type } from "@/src/shared/theme/tokens";

import { Text } from "./Text";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "lg" | "md" | "sm";

type Props = Omit<PressableProps, "style" | "children"> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
};

const HEIGHT: Record<Size, number> = { lg: 56, md: 48, sm: 40 };
const FONT_VARIANT: Record<Size, "displayM" | "displayS" | "labelCaps"> = {
  lg: "displayM",
  md: "displayS",
  sm: "labelCaps",
};

function backgroundFor(variant: Variant, pressed: boolean): string | undefined {
  switch (variant) {
    case "primary":
      return pressed ? "#E6C235" : color.brand.pila;
    case "secondary":
      return "transparent";
    case "ghost":
      return pressed ? color.border.subtle : "transparent";
    case "danger":
      return pressed ? "#C92A36" : color.state.danger;
  }
}

function textToneFor(variant: Variant): "inverse" | "primary" | "accent" {
  switch (variant) {
    case "primary":
    case "danger":
      return "inverse";
    case "secondary":
      return "accent";
    case "ghost":
      return "primary";
  }
}

function borderFor(variant: Variant): ViewStyle {
  if (variant === "secondary") {
    return { borderWidth: 2, borderColor: color.brand.pila };
  }
  return {};
}

export function Button({
  label,
  variant = "primary",
  size = "lg",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  disabled,
  onPress,
  style,
  ...rest
}: Props) {
  const haptics = useHaptics();
  const isDisabled = disabled || loading;
  const spinnerColor = variant === "primary" || variant === "danger" ? color.text.inverse : color.brand.pila;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      onPress={(e) => {
        if (isDisabled) return;
        haptics(variant === "danger" ? "medium" : "light");
        onPress?.(e);
      }}
      style={({ pressed }) => [
        {
          height: HEIGHT[size],
          borderRadius: radius.lg,
          paddingHorizontal: space.xl,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: space.sm,
          backgroundColor: backgroundFor(variant, pressed),
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          transform: pressed ? [{ scale: 0.98 }] : undefined,
          ...borderFor(variant),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <>
          {leftIcon ? <View>{leftIcon}</View> : null}
          <Text
            variant={FONT_VARIANT[size]}
            tone={textToneFor(variant)}
            style={{ ...type[FONT_VARIANT[size]] }}
          >
            {label}
          </Text>
          {rightIcon ? <View>{rightIcon}</View> : null}
        </>
      )}
    </Pressable>
  );
}
