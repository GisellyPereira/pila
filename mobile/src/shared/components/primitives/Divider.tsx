import { View, type ViewStyle } from "react-native";

import { color, space } from "@/src/shared/theme/tokens";

type Props = {
  marginY?: keyof typeof space;
  style?: ViewStyle;
};

export function Divider({ marginY = "md", style }: Props) {
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: color.border.subtle,
          marginVertical: space[marginY],
        },
        style,
      ]}
    />
  );
}
