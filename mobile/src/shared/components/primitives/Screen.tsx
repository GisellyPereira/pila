import {
  ScrollView,
  type ScrollViewProps,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { color, space } from "@/src/shared/theme/tokens";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
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
  contentPadding = "lg",
  edges = ["top"],
  style,
  scrollProps,
}: Props) {
  const horizontalPadding = PADDING_MAP[contentPadding];

  if (scroll) {
    return (
      <SafeAreaView
        edges={edges}
        style={{ flex: 1, backgroundColor: color.bg.app, ...style }}
      >
        <ScrollView
          {...scrollProps}
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: space.md,
            paddingBottom: space["3xl"],
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
      <View style={{ flex: 1, paddingHorizontal: horizontalPadding, paddingTop: space.md }}>
        {children}
      </View>
    </SafeAreaView>
  );
}
