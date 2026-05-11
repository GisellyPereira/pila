import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import { TRANSACOES_MOCK } from "@/src/data/mocks/transacoes.mock";
import { TransacaoRow } from "@/src/features/historico/components/TransacaoRow";
import {
  Card,
  Divider,
  Heading,
  Inline,
  Pill,
  Screen,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import {
  TAG_LABEL,
  type TagEmocional,
  type Transacao,
} from "@/src/domain/Transacao";
import { color, radius, space } from "@/src/shared/theme/tokens";

const FILTROS: (TagEmocional | "todos")[] = ["todos", "essencial", "superfluo", "arrependido", "merecido"];

function agruparPorDia(transacoes: Transacao[]): { dia: string; itens: Transacao[] }[] {
  const grupos = new Map<string, Transacao[]>();
  for (const t of transacoes) {
    const dia = new Date(t.data).toISOString().slice(0, 10);
    const lista = grupos.get(dia) ?? [];
    lista.push(t);
    grupos.set(dia, lista);
  }
  return [...grupos.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([dia, itens]) => ({ dia, itens }));
}

function formatarDia(diaISO: string): string {
  const hoje = new Date().toISOString().slice(0, 10);
  if (diaISO === hoje) return "Hoje";
  const d = new Date(`${diaISO}T12:00:00`);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", weekday: "long" });
}

export default function HistoricoScreen() {
  const [filtro, setFiltro] = useState<TagEmocional | "todos">("todos");

  const filtradas = useMemo(
    () =>
      filtro === "todos"
        ? TRANSACOES_MOCK
        : TRANSACOES_MOCK.filter((t) => t.tag === filtro),
    [filtro],
  );

  const grupos = useMemo(() => agruparPorDia(filtradas), [filtradas]);

  return (
    <Screen scroll>
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading level="xl">Histórico</Heading>
          <Text variant="bodyM" tone="secondary">
            Tudo que você fez. Sem panos quentes.
          </Text>
        </Stack>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
          {FILTROS.map((f) => {
            const ativo = filtro === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFiltro(f)}
                style={{
                  paddingHorizontal: space.md,
                  paddingVertical: space.sm,
                  borderRadius: radius.pill,
                  backgroundColor: ativo ? color.brand.pila : color.bg.surface,
                  borderWidth: 1,
                  borderColor: ativo ? color.brand.pila : color.border.subtle,
                }}
              >
                <Text
                  variant="labelCaps"
                  tone={ativo ? "inverse" : "secondary"}
                >
                  {f === "todos" ? "Todos" : TAG_LABEL[f as TagEmocional]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {grupos.length === 0 ? (
          <Card tone="outline" padding="lg">
            <Stack gap="sm" align="center">
              <Text variant="displayS">Nada por aqui</Text>
              <Text variant="bodyM" tone="secondary">
                Sem transações com essa tag.
              </Text>
            </Stack>
          </Card>
        ) : (
          <Stack gap="md">
            {grupos.map(({ dia, itens }) => (
              <Card key={dia} tone="surface" padding="lg">
                <Inline justify="space-between" align="baseline">
                  <Text variant="labelCaps" tone="accent">
                    {formatarDia(dia)}
                  </Text>
                  <Text variant="bodyS" tone="muted">
                    {itens.length} {itens.length === 1 ? "item" : "itens"}
                  </Text>
                </Inline>

                <Divider marginY="sm" />

                {itens.map((t, idx) => (
                  <View key={t.id}>
                    <TransacaoRow transacao={t} />
                    {idx < itens.length - 1 ? <Divider marginY="xs" /> : null}
                  </View>
                ))}
              </Card>
            ))}
          </Stack>
        )}

        <Card tone="outline" padding="lg">
          <Stack gap="sm">
            <Pill label="Por que tags emocionais?" tone="pila" size="sm" />
            <Text variant="bodyM" tone="primary">
              Você não vai trocar de cartão de crédito. Você vai notar o padrão. As tags
              (essencial / supérfluo / arrependido / mereci) mostram a relação emocional com
              cada gasto. Isso é o que muda comportamento — não a planilha.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Screen>
  );
}
