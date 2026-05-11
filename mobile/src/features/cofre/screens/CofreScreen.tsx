import { View } from "react-native";

import { METAS_MOCK } from "@/src/data/mocks/metas.mock";
import { MetaCard } from "@/src/features/cofre/components/MetaCard";
import { Jota } from "@/src/shared/components/jota/Jota";
import type { JotaExpression } from "@/src/shared/components/jota/Jota";
import {
  Button,
  Card,
  Heading,
  Inline,
  Screen,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import { progressoMeta } from "@/src/domain/Meta";
import { space } from "@/src/shared/theme/tokens";

function expressaoDaMeta(progresso: number): JotaExpression {
  if (progresso >= 0.8) return "orgulho";
  if (progresso >= 0.5) return "joinha";
  if (progresso >= 0.2) return "neutro";
  return "sobrancelha";
}

export default function CofreScreen() {
  const metaPrincipal = METAS_MOCK[0];
  const expr = expressaoDaMeta(progressoMeta(metaPrincipal));

  return (
    <Screen scroll>
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading level="xl">Cofre</Heading>
          <Text variant="bodyM" tone="secondary">
            Onde a grana fica escondida do seu eu impulsivo.
          </Text>
        </Stack>

        <Card tone="highlight" padding="lg">
          <Inline gap="md" align="center" justify="space-between">
            <Stack gap="xs" style={{ flex: 1 }}>
              <Text variant="labelCaps" tone="inverse">
                Jota disse
              </Text>
              <Text variant="bodyL" tone="inverse">
                {expr === "orgulho"
                  ? "Quase lá. Não relaxa agora."
                  : expr === "joinha"
                    ? "Tá no caminho. Sem moleza."
                    : expr === "neutro"
                      ? "Começou. Já é mais do que ontem."
                      : "Tá longe, hein. Bora apertar."}
              </Text>
            </Stack>
            <View>
              <Jota expression={expr} size={96} />
            </View>
          </Inline>
        </Card>

        <Stack gap="md">
          <Heading level="m">Suas metas</Heading>
          {METAS_MOCK.map((meta) => (
            <MetaCard key={meta.id} meta={meta} />
          ))}
        </Stack>

        <Button label="+ Guardar agora" variant="primary" size="lg" />

        <Card tone="outline" padding="lg">
          <Stack gap="sm">
            <Text variant="labelCaps" tone="accent">
              💡 Por que ter um cofre?
            </Text>
            <Text variant="bodyM" tone="primary">
              A reserva de emergência é o que separa um susto (carro, dentista, demissão) de uma
              dívida. Comece com 1 mês de gastos essenciais — depois mira em 6.
            </Text>
          </Stack>
        </Card>

        <View style={{ height: space.lg }} />
      </Stack>
    </Screen>
  );
}
