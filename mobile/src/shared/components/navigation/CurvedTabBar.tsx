import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useReducedMotion } from "@/src/shared/hooks/useReducedMotion";
import { TAB_BAR_CONTENT_HEIGHT, TAB_BAR_BUTTON_SIZE } from "./metrics";
import Svg, { Path } from "react-native-svg";

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home-outline",
  cartoes: "receipt-outline",
  contas: "calendar-outline",
  previsao: "analytics-outline",
};
export function CurvedTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const { color } = usePreferences();

  const window = useWindowDimensions();
  const [width, setWidth] = useState(window.width);
  const [keyboard, setKeyboard] = useState(false);
  const reduced = useReducedMotion();
  const routes = state.routes.filter((r) => r.name !== "perfil");
  const active = Math.max(
    0,
    routes.findIndex((r) => r.key === state.routes[state.index].key),
  );
  const step = width / routes.length;
  const position = useRef(new Animated.Value((active + 0.5) * step)).current;
  const bottomPadding = Math.max(8, insets.bottom - 16);
  const height = TAB_BAR_CONTENT_HEIGHT + bottomPadding;
  const buttonTop = (TAB_BAR_CONTENT_HEIGHT - TAB_BAR_BUTTON_SIZE) / 2;
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboard(true),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboard(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  useEffect(() => {
    const animation = Animated.timing(position, {
      toValue: (active + 0.5) * step,
      duration: reduced ? 0 : 320,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [active, step, reduced, position]);
  const center = width * 1.5;
  // O recorte e o botão compartilham a mesma translação nativa.
  const shape = `M0 10 H${center - 48} C${center - 30} 10 ${center - 32} 54 ${center} 54 C${center + 32} 54 ${center + 30} 10 ${center + 48} 10 H${width * 3} V${height} H0 Z`;
  if (keyboard) return null;
  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      pointerEvents="box-none"
      style={{
        height,
        backgroundColor: "transparent",
        overflow: "hidden",
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: -center,
          transform: [{ translateX: position }],
        }}
      >
        <Svg width={width * 3} height={height}>
          <Path d={shape} fill={color.navigation.background} />
        </Svg>
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: buttonTop,
          left: -TAB_BAR_BUTTON_SIZE / 2,
          width: TAB_BAR_BUTTON_SIZE,
          height: TAB_BAR_BUTTON_SIZE,
          borderRadius: TAB_BAR_BUTTON_SIZE / 2,
          backgroundColor: color.navigation.background,
          shadowColor: "#241336",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.18,
          shadowRadius: 6,
          elevation: 3,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ translateX: position }],
        }}
      >
        <Ionicons
          name={icons[routes[active].name]}
          size={24}
          color={color.navigation.text}
        />
      </Animated.View>
      <View style={{ flexDirection: "row" }}>
        {routes.map((route, i) => {
          const selected = i === active;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={String(
                descriptors[route.key].options.title ?? route.name,
              )}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!selected && !event.defaultPrevented)
                  navigation.navigate(route.name, route.params);
              }}
              onLongPress={() =>
                navigation.emit({ type: "tabLongPress", target: route.key })
              }
              style={{
                width: step,
                height: TAB_BAR_CONTENT_HEIGHT,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={icons[route.name]}
                size={24}
                color={color.navigation.text}
                style={{
                  opacity: selected ? 0 : 1,
                  transform: [{ translateY: 4 }],
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
