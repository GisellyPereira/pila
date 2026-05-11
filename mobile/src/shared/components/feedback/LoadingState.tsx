import { View } from "react-native";

import { Jota } from "@/src/shared/components/jota/Jota";
import { Stack, Text } from "@/src/shared/components/primitives";
import { space } from "@/src/shared/theme/tokens";

type Props = {
  message?: string;
};

export function LoadingState({ message = "Calma aí, tô processando..." }: Props) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: space["3xl"],
      }}
    >
      <Stack gap="md" align="center">
        <Jota expression="processando" size={120} />
        <Text variant="bodyM" tone="secondary">
          {message}
        </Text>
      </Stack>
    </View>
  );
}
