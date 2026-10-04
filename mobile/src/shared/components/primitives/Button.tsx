import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  View,
  type ViewStyle,
} from "react-native";
import { useHaptics } from "@/src/shared/hooks/useHaptics";
import { radius, space } from "@/src/shared/theme/tokens";
import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { Text } from "./Text";
type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "lg" | "md" | "sm";
type Props = Omit<PressableProps, "style" | "children"> & {
  label: string;
  labelColor?: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
};
const HEIGHT = { lg: 56, md: 48, sm: 44 };
export function Button({
  label,
  labelColor,
  variant = "primary",
  size = "lg",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: Props) {
  const { color, scale, t } = usePreferences();
  const [pressed, setPressed] = useState(false);
  const haptics = useHaptics();
  const isDisabled = disabled || loading;
  const actionText =
    variant === "danger" ? color.action.dangerText : color.action.text;
  const filled = variant === "primary" || variant === "danger";
  const background =
    variant === "primary"
      ? pressed
        ? color.action.pressed
        : color.action.primary
      : variant === "danger"
        ? color.action.danger
        : pressed
          ? color.bg.surfaceElevated
          : variant === "secondary"
            ? color.bg.surfaceElevated
            : "transparent";
  // Estilo concreto evita perder o fundo durante a interoperabilidade NativeWind/Pressable.
  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityLabel={rest.accessibilityLabel ?? t(label)}
      accessibilityState={{
        ...rest.accessibilityState,
        disabled: !!isDisabled,
        busy: loading,
      }}
      disabled={isDisabled}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (isDisabled) return;
        void haptics(variant === "danger" ? "medium" : "light").catch(() => {});
        onPress?.(e);
      }}
      style={{
        minHeight: HEIGHT[size] * scale,
        borderRadius: radius.lg,
        paddingHorizontal: size === "sm" ? space.lg : space.xl,
        paddingVertical: space.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: space.sm,
        alignSelf: fullWidth ? "stretch" : "flex-start",
        backgroundColor: background,
        opacity: isDisabled ? 0.65 : 1,
        ...style,
      }}
    >
      {loading ? (
        <ActivityIndicator
          color={labelColor ?? (filled ? actionText : color.text.primary)}
        />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <Text
            variant="bodyBoldM"
            style={{
              color: labelColor ?? (filled ? actionText : color.text.primary),
              textAlign: "center",
              flexShrink: 1,
            }}
          >
            {label}
          </Text>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
}
