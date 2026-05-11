import { View } from "react-native";

import { Jota, type JotaExpression } from "@/src/shared/components/jota/Jota";
import { Heading, Stack, Text } from "@/src/shared/components/primitives";
import { space } from "@/src/shared/theme/tokens";

type Props = {
  title: string;
  description?: string;
  expression?: JotaExpression;
};

export function EmptyState({ title, description, expression = "sobrancelha" }: Props) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: space["3xl"],
      }}
    >
      <Stack gap="lg" align="center">
        <Jota expression={expression} size={140} />
        <Heading level="m" tone="primary" style={{ textAlign: "center" }}>
          {title}
        </Heading>
        {description ? (
          <Text variant="bodyM" tone="secondary" style={{ textAlign: "center", maxWidth: 280 }}>
            {description}
          </Text>
        ) : null}
      </Stack>
    </View>
  );
}
