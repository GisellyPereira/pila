import { Pressable, View } from "react-native";

import { space } from "@/src/shared/theme/tokens";

import { BalaoFala } from "./BalaoFala";
import { Jota, type JotaExpression } from "./Jota";

type Props = {
  fala: string;
  expression?: JotaExpression;
  size?: number;
  onPress?: () => void;
};

export function JotaHero({ fala, expression = "neutro", size = 220, onPress }: Props) {
  const content = (
    <View style={{ alignItems: "center", gap: space.lg }}>
      <BalaoFala tail="bottomCenter">{fala}</BalaoFala>
      <Jota expression={expression} size={size} />
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
      {content}
    </Pressable>
  );
}
