import { View, type ViewStyle, type ViewProps } from "react-native";

import { space } from "@/src/shared/theme/tokens";

type SpacingKey = keyof typeof space;

type Align = "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
type Justify =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";

type Props = {
  children: React.ReactNode;
  gap?: SpacingKey;
  align?: Align;
  justify?: Justify;
  style?: ViewStyle;
  onLayout?: ViewProps["onLayout"];
};

export function Stack({
  children,
  gap = "md",
  align,
  justify,
  style,
  onLayout,
}: Props) {
  return (
    <View
      onLayout={onLayout}
      style={[
        { flexDirection: "column", gap: space[gap] },
        align ? { alignItems: align } : null,
        justify ? { justifyContent: justify } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Inline({
  children,
  gap = "md",
  align = "center",
  justify,
  style,
  onLayout,
}: Props) {
  return (
    <View
      onLayout={onLayout}
      style={[
        { flexDirection: "row", gap: space[gap] },
        align ? { alignItems: align } : null,
        justify ? { justifyContent: justify } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}
