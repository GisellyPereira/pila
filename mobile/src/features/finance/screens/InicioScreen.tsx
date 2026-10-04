import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePila } from "@/src/app/providers/PilaProvider";
import {
  ateProximaReceita,
  eventosDoMes,
  resumoPlanejado,
  saldoAtual,
} from "@/src/domain/Planejamento";
import {
  Button,
  Heading,
  Inline,
  Money,
  Screen,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import { FinanceForm, type FormTarget } from "../components/FinanceForm";
import { MonthPicker, dataCurta } from "../components/FinanceUI";
import { BudgetRing, QuickAction } from "../components/VisualFinance";
import { RegisterSheet } from "../components/RegisterSheet";
export default function InicioScreen() {
  const { color, language, t } = usePreferences();
  const { estado, mes, storageError, carregarExemplo } = usePila();
  const [form, setForm] = useState<FormTarget | null>(null);
  const [register, setRegister] = useState(false);
  const router = useRouter();
  const resumo = useMemo(() => resumoPlanejado(estado, mes), [estado, mes]);
  const disponivel = useMemo(() => ateProximaReceita(estado), [estado]);
  const eventos = useMemo(() => eventosDoMes(estado, mes), [estado, mes]);
  return (
    <Screen scroll>
      <Stack gap="xl">
        <Inline justify="space-between">
          <Stack gap="xs">
            <Text variant="bodyS" tone="secondary">
              Seu planejamento
            </Text>
            <Heading level="l">Visão geral</Heading>
          </Stack>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("Ajustes")}
            onPress={() => router.push("/ajustes")}
            style={{
              padding: 13,
              borderRadius: 16,
              backgroundColor: color.bg.surface,
            }}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={color.text.primary}
            />
          </Pressable>
        </Inline>
        {!estado.configurado ? (
          <Stack gap="xl">
            <View
              style={{
                padding: 26,
                borderRadius: 30,
                backgroundColor: color.hero.background,
                gap: 18,
              }}
            >
              <Text variant="bodyS" style={{ color: color.hero.muted }}>
                Comece por aqui
              </Text>
              <Heading level="l" style={{ color: color.hero.text }}>
                Organize seu primeiro mês
              </Heading>
              <Text style={{ color: color.hero.muted }}>
                Salário, contas e compras. Um passo de cada vez.
              </Text>
              <Button
                label="Informar renda e saldo"
                onPress={() => setForm({ tipo: "configurar" })}
                labelColor={color.hero.background}
                style={{ backgroundColor: color.hero.text }}
              />
            </View>
            <Stack gap="lg">
              {[
                {
                  label: "Renda e saldo",
                  icon: "cash-outline" as const,
                  background: color.bg.surface,
                  ink: color.text.accent,
                },
                {
                  label: "Contas do mês",
                  icon: "calendar-outline" as const,
                  background: color.feature.blueSurface,
                  ink: color.feature.blueInk,
                },
                {
                  label: "Compras no cartão",
                  icon: "card-outline" as const,
                  background: color.feature.roseSurface,
                  ink: color.feature.roseInk,
                },
              ].map((step) => (
                <Pressable
                  key={step.label}
                  accessibilityRole="button"
                  accessibilityLabel={t(step.label)}
                  onPress={() => {
                    if (step.icon === "card-outline") setRegister(true);
                    else
                      setForm({
                        tipo:
                          step.icon === "cash-outline" ? "configurar" : "conta",
                      });
                  }}
                  style={{
                    padding: 18,
                    backgroundColor: step.background,
                    borderRadius: 20,
                  }}
                >
                  <Inline>
                    <Ionicons name={step.icon} size={25} color={step.ink} />
                    <Text
                      variant="bodyBoldM"
                      style={{ flex: 1, color: step.ink }}
                    >
                      {step.label}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={step.ink}
                    />
                  </Inline>
                </Pressable>
              ))}
            </Stack>
            {!storageError &&
              !estado.receitas.length &&
              !estado.contas.length &&
              !estado.cartoes.length &&
              !estado.compras.length &&
              !estado.movimentos.length && (
                <Button
                  label="Explorar um mês preenchido"
                  variant="secondary"
                  onPress={carregarExemplo}
                />
              )}
          </Stack>
        ) : (
          <>
            {estado.exemplo && (
              <Text variant="bodyS" tone="secondary">
                Modo demonstração
              </Text>
            )}
            <View
              style={{
                padding: 26,
                borderRadius: 30,
                backgroundColor: color.hero.background,
                gap: 18,
              }}
            >
              <Inline justify="space-between">
                <Text variant="bodyBoldM" style={{ color: color.hero.muted }}>
                  Saldo disponível hoje
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t("Atualizar saldo")}
                  onPress={() => setForm({ tipo: "saldo" })}
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="create-outline"
                    size={23}
                    color={color.hero.text}
                  />
                </Pressable>
              </Inline>
              <Money
                value={saldoAtual(estado)}
                size="xl"
                style={{ color: color.hero.text }}
              />
              <Inline justify="space-between" align="flex-start">
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Text variant="bodyS" style={{ color: color.hero.muted }}>
                    Livre até a próxima entrada
                  </Text>
                  <Money
                    value={disponivel.livre}
                    size="m"
                    style={{ color: color.hero.text }}
                  />
                </Stack>
                <Stack gap="xs" align="flex-end">
                  <Text variant="bodyS" style={{ color: color.hero.muted }}>
                    A pagar até
                  </Text>
                  <Text variant="bodyBoldM" style={{ color: color.hero.text }}>
                    {dataCurta(disponivel.ate, language)}
                  </Text>
                </Stack>
              </Inline>
              {disponivel.livre < 0 && (
                <Text variant="bodyS" style={{ color: color.hero.text }}>
                  Há compromissos acima do saldo disponível.
                </Text>
              )}
            </View>
            <Inline gap="md" align="stretch">
              <QuickAction
                label="Registrar"
                tone="rose"
                icon="add"
                primary
                onPress={() => setRegister(true)}
              />
              <QuickAction
                label="Nova conta"
                tone="blue"
                icon="calendar-outline"
                onPress={() => setForm({ tipo: "conta" })}
              />
              <QuickAction
                label="Simular"
                tone="slate"
                icon="analytics-outline"
                onPress={() => router.push("/(tabs)/previsao")}
              />
            </Inline>
            <Stack gap="md">
              <MonthPicker />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("Explorar planejamento")}
                onPress={() => router.push("/(tabs)/previsao")}
                style={{
                  padding: 20,
                  borderRadius: 26,
                  backgroundColor: color.feature.slateSurface,
                }}
              >
                <Inline align="center">
                  <BudgetRing
                    income={resumo.renda}
                    committed={resumo.comprometido + resumo.reserva}
                  />
                  <Stack gap="lg" style={{ flex: 1 }}>
                    <Stack gap="xs">
                      <Text variant="bodyS" tone="secondary">
                        Receitas previstas
                      </Text>
                      <Money value={resumo.renda} size="m" />
                    </Stack>
                    <Stack gap="xs">
                      <Text variant="bodyS" tone="secondary">
                        Previsão do fechamento
                      </Text>
                      <Money
                        value={resumo.sobra}
                        size="m"
                        tone={resumo.sobra < 0 ? "negative" : "neutral"}
                      />
                    </Stack>
                  </Stack>
                </Inline>
              </Pressable>
            </Stack>
            <Stack gap="lg">
              <Inline justify="space-between">
                <Heading level="m">Próximos compromissos</Heading>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push("/(tabs)/contas")}
                  style={{ paddingVertical: 12 }}
                >
                  <Text variant="bodyS" tone="accent">
                    Ver agenda
                  </Text>
                </Pressable>
              </Inline>
              {eventos.slice(0, 3).map((e) => (
                <Pressable
                  key={e.chave}
                  accessibilityRole="button"
                  accessibilityLabel={`${t("Ver agenda")}: ${e.nome}`}
                  onPress={() => router.push("/(tabs)/contas")}
                  style={{
                    padding: 16,
                    borderRadius: 20,
                    backgroundColor:
                      e.tipo === "entrada"
                        ? color.feature.slateSurface
                        : color.feature.roseSurface,
                  }}
                >
                  <Inline>
                    <View style={{ minWidth: 40, alignItems: "center" }}>
                      <Text variant="displayS">{e.data.slice(8)}</Text>
                      <Text variant="bodyS" tone="secondary">
                        {e.data.slice(5, 7)}
                      </Text>
                    </View>
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Text variant="bodyBoldM" translatable={false}>
                        {e.nome}
                      </Text>
                      <Text variant="bodyS" tone="secondary">
                        {e.tipo === "entrada" ? "A receber" : "A pagar"}
                      </Text>
                    </Stack>
                    <Money value={e.valor} size="m" />
                  </Inline>
                </Pressable>
              ))}
              {!eventos.length && <Text tone="secondary">Agenda em dia</Text>}
            </Stack>
          </>
        )}
        {storageError && (
          <Text tone="danger">
            Não foi possível salvar no aparelho. Preserve seus registros antes
            de fechar o app.
          </Text>
        )}
      </Stack>
      {form && <FinanceForm target={form} onClose={() => setForm(null)} />}
      {register && <RegisterSheet onClose={() => setRegister(false)} />}
    </Screen>
  );
}
