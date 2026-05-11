import { View } from "react-native";

import type { Conquista } from "@/src/domain/Conquista";
import { Card, Stack, Text } from "@/src/shared/components/primitives";
import { color, radius, space } from "@/src/shared/theme/tokens";

type Props = {
  conquistas: Conquista[];
};

export function TrofeuGrid({ conquistas }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: space.md,
      }}
    >
      {conquistas.map((c) => {
        const ativa = c.desbloqueada;
        return (
          <Card
            key={c.id}
            tone={ativa ? "surface" : "outline"}
            padding="md"
            style={{
              width: "47%",
              opacity: ativa ? 1 : 0.5,
            }}
          >
            <Stack gap="sm" align="center">
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.pill,
                  backgroundColor: ativa ? color.brand.pila : color.bg.surfaceElevated,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text variant="displayM" tone={ativa ? "inverse" : "muted"}>
                  {ativa ? "🏆" : "🔒"}
                </Text>
              </View>
              <Text
                variant="bodyBoldM"
                tone="primary"
                style={{ textAlign: "center" }}
              >
                {c.nome}
              </Text>
              <Text
                variant="bodyS"
                tone="muted"
                style={{ textAlign: "center" }}
              >
                {c.descricao}
              </Text>
            </Stack>
          </Card>
        );
      })}
    </View>
  );
}
