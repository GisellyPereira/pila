import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { usePila } from "@/src/app/providers/PilaProvider";
import { eventosDoMes, pago, saldoAtual } from "@/src/domain/Planejamento";
import { PageTitle } from "@/src/shared/components/primitives/PageTitle";
import { Sheet } from "@/src/shared/components/primitives/Sheet";
import {
  Button,
  Heading,
  Inline,
  Money,
  Screen,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import { space } from "@/src/shared/theme/tokens";
import { FinanceForm, type FormTarget } from "../components/FinanceForm";
import { Empty, MonthPicker } from "../components/FinanceUI";
export default function PerfilScreen() {
  const { estado, mes, reiniciar, storageError } = usePila();
  const router = useRouter();
  const [form, setForm] = useState<FormTarget | null>(null);
  const [reset, setReset] = useState(false);
  const eventos = eventosDoMes(estado, mes);
  return (
    <Screen scroll>
      <PageTitle
        label="Dados do seu planejamento"
        title="Minha renda e dados"
        description="Mantenha os valores atualizados para que as previsões acompanhem sua realidade."
      />
      <MonthPicker />
      <Stack gap="lg" style={{ marginTop: space.xl }}>
        <Inline justify="space-between">
          <Heading level="m">Suas receitas</Heading>
          <Pressable
            accessibilityRole="button"
            onPress={() => setForm({ tipo: "receita" })}
          >
            <Text variant="bodyBoldM">Adicionar</Text>
          </Pressable>
        </Inline>
        {estado.receitas.length ? (
          estado.receitas.map((r) => {
            const evento = eventos.find(
              (e) => e.origem === "receita" && e.referencia === r.id,
            );
            const recebeu = pago(estado, "receita", r.id, mes) > 0;
            return (
              <Stack key={r.id} gap="md" style={{ paddingVertical: space.sm }}>
                <Inline justify="space-between" align="flex-start">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text variant="bodyBoldM" translatable={false}>
                      {r.nome}
                    </Text>
                    <Text variant="bodyS" tone="muted">
                      Mensal · dia {r.dia}
                    </Text>
                  </Stack>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setForm({ tipo: "receita", item: r })}
                  >
                    <Text variant="bodyS">Editar</Text>
                  </Pressable>
                </Inline>
                <Money value={r.valor} size="m" />
                {evento ? (
                  <Button
                    label="Ver recebimento na Agenda"
                    variant="secondary"
                    size="md"
                    onPress={() => router.push("/(tabs)/contas")}
                  />
                ) : recebeu ? (
                  <Text variant="bodyS" tone="success">
                    Recebimento registrado neste mês
                  </Text>
                ) : (
                  <Text variant="bodyS" tone="muted">
                    Esta receita ainda não começou no mês selecionado.
                  </Text>
                )}
              </Stack>
            );
          })
        ) : (
          <Empty
            title="Informe suas entradas"
            description="Salário, benefícios e outras rendas mensais entram na previsão. Registre o recebimento quando o dinheiro chegar."
          />
        )}
      </Stack>
      <Stack gap="lg" style={{ marginTop: space["2xl"] }}>
        <Heading level="m">Saldo disponível hoje</Heading>
        <Money value={saldoAtual(estado)} size="l" />
        <Text tone="secondary">
          Pagamentos e recebimentos registrados alteram esse saldo. Use a
          atualização para conferir o valor real na sua conta.
        </Text>
        <Button
          label="Atualizar saldo real"
          variant="secondary"
          size="md"
          onPress={() => setForm({ tipo: "saldo" })}
        />
        {!estado.configurado && (
          <Button
            label="Configurar salário e saldo"
            onPress={() => setForm({ tipo: "configurar" })}
          />
        )}
      </Stack>
      <Stack gap="lg" style={{ marginTop: space["2xl"] }}>
        <Heading level="m">Seus dados</Heading>
        <Text variant="bodyS" tone="secondary">
          {estado.exemplo
            ? "Você está explorando dados de exemplo. Comece uma conta vazia para cadastrar suas informações."
            : "Os dados são salvos neste aparelho. Não há sincronização bancária; os lançamentos são informados por você."}
        </Text>
        {storageError && (
          <Text tone="danger">
            Não foi possível salvar ou carregar os dados. O arquivo anterior foi
            preservado. Confira o armazenamento antes de recomeçar.
          </Text>
        )}
        <Button
          label={
            estado.exemplo
              ? "Começar meu planejamento do zero"
              : "Apagar dados e começar do zero"
          }
          variant="ghost"
          size="md"
          onPress={() => setReset(true)}
        />
      </Stack>
      <Sheet
        visible={reset}
        title="Começar um novo planejamento?"
        onClose={() => setReset(false)}
      >
        <Stack gap="xl">
          <Text>
            Isso apaga os cadastros, compras e movimentações deste planejamento
            no aparelho. A ação não pode ser desfeita.
          </Text>
          <Button
            label="Apagar e começar do zero"
            variant="danger"
            onPress={() => {
              reiniciar();
              setReset(false);
            }}
          />
          <Button
            label="Manter meus dados"
            variant="secondary"
            onPress={() => setReset(false)}
          />
        </Stack>
      </Sheet>
      {form && <FinanceForm target={form} onClose={() => setForm(null)} />}
    </Screen>
  );
}
