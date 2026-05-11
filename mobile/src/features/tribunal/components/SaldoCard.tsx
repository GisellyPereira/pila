import { View } from "react-native";

import { Card, Inline, Money, Stack, Text } from "@/src/shared/components/primitives";
import { color, space } from "@/src/shared/theme/tokens";

type Props = {
  sobrou: number;
  entradas: number;
  saidas: number;
};

export function SaldoCard({ sobrou, entradas, saidas }: Props) {
  return (
    <Card tone="surface" padding="lg">
      <Stack gap="sm">
        <Text variant="labelCaps" tone="secondary">
          Sobrou esse mês
        </Text>
        <Money value={sobrou} size="xl" tone="accent" />
        <Text variant="bodyS" tone="secondary">
          Calma com isso, hein.
        </Text>

        <View
          style={{
            height: 1,
            backgroundColor: color.border.subtle,
            marginVertical: space.md,
          }}
        />

        <Inline justify="space-between">
          <Stack gap="xs">
            <Text variant="labelCaps" tone="muted">
              Entrou
            </Text>
            <Money value={entradas} size="m" tone="positive" />
          </Stack>
          <Stack gap="xs" align="flex-end">
            <Text variant="labelCaps" tone="muted">
              Saiu
            </Text>
            <Money value={saidas} size="m" tone="negative" />
          </Stack>
        </Inline>
      </Stack>
    </Card>
  );
}
