import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import {
  ScrollView,
  type ScrollViewProps,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useSegments } from "expo-router";

import { space } from "@/src/shared/theme/tokens";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  scrollRef?: React.RefObject<ScrollView | null>;
  contentPadding?: keyof typeof space | "none";
  edges?: Edge[];
  style?: ViewStyle;
  scrollProps?: Omit<ScrollViewProps, "children" | "contentContainerStyle">;
};

const PADDING_MAP = {
  none: 0,
  xs: space.xs,
  sm: space.sm,
  md: space.md,
  lg: space.lg,
  xl: space.xl,
  "2xl": space["2xl"],
  "3xl": space["3xl"],
  "4xl": space["4xl"],
} as const;

export function Screen({
  children,
  scroll = false,
  scrollRef,
  contentPadding = "xl",
  edges = ["top"],
  style,
  scrollProps,
}: Props) {
  const { color } = usePreferences();

  const segments = useSegments();
  const bottomPadding = segments.some((segment) => segment === "(tabs)")
    ? space.xl
    : space["3xl"];
  const horizontalPadding = PADDING_MAP[contentPadding];

  if (scroll) {
    return (
      <SafeAreaView
        edges={edges}
        style={{ flex: 1, backgroundColor: color.bg.app, ...style }}
      >
        <ScrollView
          ref={scrollRef}
          {...scrollProps}
          contentContainerStyle={{
            width: "100%",
            maxWidth: 560,
            alignSelf: "center",
            paddingHorizontal: horizontalPadding,
            paddingTop: space.md,
            paddingBottom: bottomPadding,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={edges}
      style={{ flex: 1, backgroundColor: color.bg.app, ...style }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: horizontalPadding,
          paddingTop: space.md,
          paddingBottom: bottomPadding,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
