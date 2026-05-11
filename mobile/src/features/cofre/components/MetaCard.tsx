import { View } from "react-native";

import { progressoMeta, type Meta } from "@/src/domain/Meta";
import {
  Card,
  Heading,
  Inline,
  Money,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import { color, radius, space } from "@/src/shared/theme/tokens";

type Props = {
  meta: Meta;
};

function corDoProgresso(progresso: number): string {
  if (progresso >= 0.75) return color.state.success;
  if (progresso >= 0.4) return color.brand.pila;
  return color.state.warning;
}

export function MetaCard({ meta }: Props) {
  const progresso = progressoMeta(meta);
  const percent = Math.round(progresso * 100);
  const corBarra = corDoProgresso(progresso);

  return (
    <Card tone="surface" padding="lg">
      <Stack gap="md">
        <Inline justify="space-between" align="center">
          <Inline gap="sm" align="center">
            {meta.emoji ? (
              <Text variant="displayM" tone="primary">
                {meta.emoji}
              </Text>
            ) : null}
            <Heading level="s">{meta.nome}</Heading>
          </Inline>
          <Text variant="labelCaps" tone="accent">
            {percent}%
          </Text>
        </Inline>

        <View>
          <View
            style={{
              height: 10,
              backgroundColor: color.bg.surfaceElevated,
              borderRadius: radius.pill,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${percent}%`,
                backgroundColor: corBarra,
                borderRadius: radius.pill,
              }}
            />
          </View>
        </View>

        <Inline justify="space-between" align="baseline">
          <Money value={meta.valorAtual} size="m" tone="accent" />
          <Inline gap="xs" align="baseline">
            <Text variant="bodyS" tone="muted">
              de
            </Text>
            <Money value={meta.valorAlvo} size="m" tone="neutral" />
          </Inline>
        </Inline>

        {meta.prazo ? (
          <Text variant="bodyS" tone="secondary">
            Prazo: {meta.prazo}
          </Text>
        ) : null}
      </Stack>
      <View style={{ height: space.xs }} />
    </Card>
  );
}
