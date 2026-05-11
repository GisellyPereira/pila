import { useMemo, useState } from "react";

import { MISSOES_MOCK } from "@/src/data/mocks/missoes.mock";
import { MissaoItem } from "@/src/features/missoes/components/MissaoItem";
import {
  Card,
  Heading,
  Inline,
  Pill,
  Screen,
  Stack,
  Text,
} from "@/src/shared/components/primitives";

export default function MissoesScreen() {
  const [expandida, setExpandida] = useState<string | null>(null);

  const respeitoPossivel = useMemo(
    () =>
      MISSOES_MOCK.filter((m) => !m.concluida).reduce(
        (acc, m) => acc + m.recompensaRespeito,
        0,
      ),
    [],
  );

  const concluidas = MISSOES_MOCK.filter((m) => m.concluida).length;

  return (
    <Screen scroll>
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading level="xl">Missões</Heading>
          <Text variant="bodyM" tone="secondary">
            Hábitos pequenos. Resultado grande. Bora.
          </Text>
        </Stack>

        <Card tone="highlight" padding="lg">
          <Inline justify="space-between" align="center">
            <Stack gap="xs">
              <Text variant="labelCaps" tone="inverse">
                Esta semana
              </Text>
              <Heading level="l" tone="inverse">
                +{respeitoPossivel} Respeito
              </Heading>
              <Text variant="bodyS" tone="inverse">
                {concluidas} de {MISSOES_MOCK.length} concluídas
              </Text>
            </Stack>
            <Pill label="Tribunal aberto" tone="coral" />
          </Inline>
        </Card>

        <Stack gap="md">
          {MISSOES_MOCK.map((missao) => (
            <MissaoItem
              key={missao.id}
              missao={missao}
              expanded={expandida === missao.id}
              onToggle={() => setExpandida(expandida === missao.id ? null : missao.id)}
            />
          ))}
        </Stack>

        <Card tone="outline" padding="lg">
          <Stack gap="sm">
            <Text variant="labelCaps" tone="accent">
              Como funciona
            </Text>
            <Text variant="bodyM" tone="primary">
              Missões são hábitos pequenos que, juntos, mudam padrões de consumo. Concluir gera
              Respeito (o XP do Jota) — que sobe seu nível no Tribunal.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Screen>
  );
}
