import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Text } from "@/src/shared/components/primitives/Text";
import { color, motion, radius, space } from "@/src/shared/theme/tokens";

type Props = {
  children: React.ReactNode;
  /** Side where the tail points to (matches the Jota's relative position). */
  tail?: "bottomLeft" | "bottomCenter" | "topCenter";
};

export function BalaoFala({ children, tail = "bottomLeft" }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: motion.base, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(0, { duration: motion.base, easing: Easing.out(Easing.cubic) });
  }, [children, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const tailStyle = (() => {
    switch (tail) {
      case "bottomCenter":
        return { bottom: -8, left: "50%" as const, marginLeft: -10 };
      case "topCenter":
        return { top: -8, left: "50%" as const, marginLeft: -10 };
      default:
        return { bottom: -8, left: 32 };
    }
  })();

  return (
    <Animated.View style={[{ maxWidth: 320 }, animatedStyle]}>
      <View
        style={{
          backgroundColor: color.accent.creme,
          borderRadius: radius.xl,
          paddingHorizontal: space.xl,
          paddingVertical: space.md,
        }}
      >
        <Text variant="bubble" style={{ color: color.text.inverse }}>
          {children}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          backgroundColor: color.accent.creme,
          transform: [{ rotate: "45deg" }],
          borderRadius: 4,
          ...tailStyle,
        }}
      />
    </Animated.View>
  );
}
