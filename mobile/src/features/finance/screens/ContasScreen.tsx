import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { usePila } from "@/src/app/providers/PilaProvider";
import { diaLocal } from "@/src/domain/Carteira";
import {
  diaConta,
  dataVencimento,
  eventosDoMes,
  valorConta,
} from "@/src/domain/Planejamento";
import { PageTitle } from "@/src/shared/components/primitives/PageTitle";
import {
  Button,
  Heading,
  Inline,
  Money,
  Screen,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import { radius, space } from "@/src/shared/theme/tokens";
import { MonthStrip } from "../components/MonthStrip";
import { FinanceForm, type FormTarget } from "../components/FinanceForm";
import {
  Choices,
  Empty,
  MonthPicker,
  dataCurta,
} from "../components/FinanceUI";
export default function ContasScreen() {
  const { color, language, t } = usePreferences();

  const { estado, mes, confirmar } = usePila();
  const [form, setForm] = useState<FormTarget | null>(null);
  const [day, setDay] = useState<string | null>(null);
  useEffect(() => setDay(null), [mes]);
  const [filtro, setFiltro] = useState("pendentes");
  const eventos = useMemo(() => eventosDoMes(estado, mes), [estado, mes]);
  const contas = useMemo(
    () => estado.contas.filter((c) => valorConta(c, mes) > 0),
    [estado.contas, mes],
  );
  const realizados = useMemo(
    () =>
      estado.movimentos
        .filter(
          (m) =>
            m.origem !== "avulsa" &&
            (m.competencia ?? m.data.slice(0, 7)) === mes,
        )
        .sort((a, b) => b.data.localeCompare(a.data)),
    [estado.movimentos, mes],
  );
  const pendente =
    eventos
      .filter((e) => e.tipo === "saida")
      .reduce((s, e) => s + Math.round(e.valor * 100), 0) / 100;
  const visibleEvents = day ? eventos.filter((e) => e.data === day) : eventos;
  const incoming =
    eventos
      .filter((e) => e.tipo === "entrada")
      .reduce((sum, e) => sum + Math.round(e.valor * 100), 0) / 100;
  return (
    <Screen scroll>
      <PageTitle
        title="Agenda"
        description="Toque em um compromisso para confirmar o pagamento ou recebimento. Registre somente quando o dinheiro tiver movimentado."
      />
      <MonthPicker />
      <Stack gap="xl">
        <Inline
          style={{
            padding: 24,
            borderRadius: 28,
            backgroundColor: color.feature.blueStrong,
          }}
          align="flex-start"
          justify="space-between"
        >
          <Stack gap="sm" style={{ flex: 1 }}>
            <Text variant="bodyS" style={{ color: color.feature.blueMuted }}>
              A pagar
            </Text>
            <Money
              value={pendente}
              size="l"
              style={{ color: color.feature.blueText }}
            />
          </Stack>
          <Stack gap="sm" style={{ flex: 1 }}>
            <Text variant="bodyS" style={{ color: color.feature.blueMuted }}>
              A receber
            </Text>
            <Money
              value={incoming}
              size="m"
              style={{ color: color.feature.blueText }}
            />
          </Stack>
        </Inline>
        <Inline gap="md">
          <Button
            label="Adicionar conta"
            size="md"
            style={{ flex: 1 }}
            onPress={() => setForm({ tipo: "conta" })}
          />
          <Button
            label="Adicionar renda"
            size="md"
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => setForm({ tipo: "receita" })}
          />
        </Inline>
        <Choices
          items={[
            { label: "Pendentes", value: "pendentes" },
            { label: "Concluídos", value: "concluidos" },
            { label: "Cadastros", value: "cadastros" },
          ]}
          value={filtro}
          onChange={setFiltro}
        />
        {filtro === "pendentes" && (
          <Stack gap="lg">
            <MonthStrip
              mes={mes}
              events={eventos}
              selected={day}
              onSelect={setDay}
            />
            <Inline justify="space-between">
              <Text variant="bodyBoldM">
                {day ? dataCurta(day, language) : "Mês inteiro"}
              </Text>
              {day && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setDay(null)}
                  style={{ padding: 10 }}
                >
                  <Text variant="bodyS" tone="accent">
                    Ver mês inteiro
                  </Text>
                </Pressable>
              )}
            </Inline>
            {visibleEvents.map((e) => (
              <Pressable
                key={e.chave}
                accessibilityRole="button"
                accessibilityLabel={`${t(e.tipo === "entrada" ? "Registrar recebimento" : "Registrar pagamento")}: ${e.nome}`}
                onPress={() => confirmar(e)}
                style={{
                  padding: 18,
                  borderRadius: 22,
                  backgroundColor:
                    e.tipo === "entrada"
                      ? color.feature.slateSurface
                      : color.feature.roseSurface,
                }}
              >
                <Inline>
                  <View style={{ width: 38, alignItems: "center" }}>
                    <Text variant="displayS">{e.data.slice(8)}</Text>
                    <Text variant="bodyS" tone="secondary">
                      {e.data.slice(5, 7)}
                    </Text>
                  </View>
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text variant="bodyBoldM" translatable={false}>
                      {e.nome}
                    </Text>
                    <Text
                      variant="bodyS"
                      tone={
                        e.data < diaLocal() && e.tipo === "saida"
                          ? "danger"
                          : "secondary"
                      }
                    >
                      {e.tipo === "entrada"
                        ? "A receber"
                        : e.data < diaLocal()
                          ? "Vencido"
                          : "A pagar"}
                    </Text>
                  </Stack>
                  <Money value={e.valor} size="m" />
                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={color.text.accent}
                  />
                </Inline>
              </Pressable>
            ))}
            {!visibleEvents.length && (
              <Stack
                gap="md"
                style={{
                  padding: 24,
                  borderRadius: 24,
                  backgroundColor: color.bg.surface,
                }}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={32}
                  color={color.text.accent}
                />
                <Heading level="m">
                  {day ? "Dia livre" : "Agenda em dia"}
                </Heading>
                <Text variant="bodyS" tone="secondary">
                  Nenhum compromisso pendente.
                </Text>
              </Stack>
            )}
          </Stack>
        )}
        {filtro === "concluidos" && (
          <Stack gap="lg">
            {realizados.map((m) => (
              <Inline key={m.id} justify="space-between" align="flex-start">
                <Stack gap="xs" style={{ flex: 1, marginRight: 12 }}>
                  <Text variant="bodyBoldM" translatable={false}>
                    {m.descricao}
                  </Text>
                  <Text variant="bodyS" tone="secondary">
                    {dataCurta(m.data, language)} ·{" "}
                    {m.tipo === "entrada" ? "Recebido" : "Pagamento registrado"}
                    {m.incluidoNoSaldoInicial
                      ? " · incluído no saldo informado"
                      : ""}
                  </Text>
                </Stack>
                <Money value={m.valor} size="m" />
              </Inline>
            ))}
            {!realizados.length && (
              <Empty
                title="Os registros aparecem aqui"
                description="Ao confirmar um pagamento ou recebimento, ele sai dos pendentes e fica neste histórico."
              />
            )}
          </Stack>
        )}
        {filtro === "cadastros" && (
          <Stack gap="lg">
            <Heading level="m">Suas contas</Heading>
            {contas.map((c) => (
              <Pressable
                key={c.id}
                accessibilityRole="button"
                accessibilityLabel={`Editar ${c.nome}`}
                onPress={() => setForm({ tipo: "conta", item: c })}
                style={{
                  padding: space.xl,
                  borderRadius: radius.xl,
                  backgroundColor: color.bg.surface,
                }}
              >
                <Inline justify="space-between">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text variant="bodyBoldM" translatable={false}>
                      {c.nome}
                    </Text>
                    <Text variant="bodyS" tone="secondary">
                      {c.tipo === "fixa"
                        ? "Mensal"
                        : c.tipo === "parcelada"
                          ? "Parcelada"
                          : "Pontual"}{" "}
                      ·{" "}
                      {dataCurta(
                        dataVencimento(mes, diaConta(c, mes)),
                        language,
                      )}
                    </Text>
                    <Text variant="bodyS">Editar cadastro</Text>
                  </Stack>
                  <Money value={valorConta(c, mes)} size="m" />
                </Inline>
              </Pressable>
            ))}
            {!contas.length && (
              <Empty
                title="Cadastre seus compromissos"
                description="Aluguel, internet, empréstimos e outras contas. As mensais reaparecem na agenda automaticamente."
              />
            )}
          </Stack>
        )}
      </Stack>
      {form && <FinanceForm target={form} onClose={() => setForm(null)} />}
    </Screen>
  );
}
