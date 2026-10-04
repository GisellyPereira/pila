import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { useMemo, useState } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePila } from "@/src/app/providers/PilaProvider";
import { diaLocal, lerValor } from "@/src/domain/Carteira";
import {
  distanciaMes,
  limiteDisponivel,
  mesAtual,
  primeiraFatura,
  parcelaCompra,
  somarMes,
  valorFatura,
  previsao,
  type Financas,
} from "@/src/domain/Planejamento";
import { PageTitle } from "@/src/shared/components/primitives/PageTitle";
import {
  Heading,
  Inline,
  Money,
  Screen,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import {
  Choices,
  Field,
  ValueRow,
  dataCurta,
  nomeMes,
} from "../components/FinanceUI";
import { ForecastChart } from "../components/ForecastChart";
import { FinanceForm, type FormTarget } from "../components/FinanceForm";

export default function PrevisaoScreen() {
  const { color, language } = usePreferences();

  const { estado } = usePila();
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [forma, setForma] = useState("avista");
  const [selected, setSelected] = useState(0);
  const [form, setForm] = useState<FormTarget | null>(null);
  const total = lerValor(valor);
  const numero = /^\d+$/.test(parcelas) ? Number(parcelas) : 0;
  const cartao = estado.cartoes.find((c) => c.id === forma);
  const primeira = cartao ? primeiraFatura(cartao, diaLocal()) : mesAtual();
  const valido =
    total !== null &&
    (forma === "avista" ||
      (!!cartao &&
        numero >= 1 &&
        numero <= 60 &&
        Math.round(total * 100) >= numero));
  const quantidade =
    valido && cartao
      ? Math.max(6, numero + distanciaMes(mesAtual(), primeira))
      : 6;
  const base = useMemo(
    () => previsao(estado, quantidade),
    [estado, quantidade],
  );
  const comparacao = useMemo(() => {
    let comCompra: Financas = estado;
    if (valido && total !== null) {
      comCompra = cartao
        ? {
            ...estado,
            compras: [
              ...estado.compras,
              {
                id: "simulacao",
                cartaoId: cartao.id,
                nome: "Compra simulada",
                total,
                parcelas: numero,
                data: diaLocal(),
                primeiraFatura: primeira,
              },
            ],
          }
        : {
            ...estado,
            movimentos: [
              ...estado.movimentos,
              {
                id: "simulacao",
                descricao: "Compra simulada",
                valor: total,
                tipo: "saida",
                data: diaLocal(),
                origem: "avulsa",
              },
            ],
          };
    }
    if (valido && cartao && total !== null) {
      const simulada = comCompra.compras[comCompra.compras.length - 1];
      // A nova compra acrescenta parcelas mesmo quando a base é um total de fatura informado.
      const ajustes = Array.from({ length: numero }, (_, i) => {
        const mes = somarMes(primeira, i);
        return {
          id: `simulacao-fatura-${i}`,
          nome: "Fatura simulada",
          cartaoId: cartao.id,
          total:
            valorFatura(estado, cartao.id, mes) + parcelaCompra(simulada, mes),
          parcelas: 1,
          data: diaLocal(),
          primeiraFatura: mes,
          faturaImportada: true,
        };
      });
      comCompra = { ...comCompra, compras: [...comCompra.compras, ...ajustes] };
    }
    return valido ? previsao(comCompra, quantidade) : null;
  }, [estado, valido, total, cartao, numero, primeira, quantidade]);
  const riscos = comparacao?.filter((p) => p.menorSaldo < 0) ?? [];
  const limiteExcedido =
    cartao && total !== null && total > limiteDisponivel(estado, cartao);
  const current = (comparacao ?? base)[Math.min(selected, base.length - 1)];
  const before = base[Math.min(selected, base.length - 1)];
  return (
    <Screen scroll>
      <PageTitle
        title="Planejar"
        description="A previsão usa seu saldo atual, receitas, contas e parcelas cadastradas. Considere todos os custos da compra no valor total. A simulação não salva registros."
      />
      <Stack gap="xl">
        <Stack
          gap="md"
          style={{
            padding: 22,
            backgroundColor: color.feature.blueSurface,
            borderRadius: 28,
          }}
        >
          <Inline justify="space-between">
            <Text variant="bodyS" tone="secondary">
              {nomeMes(current.mes, false, language)}
            </Text>
            <Text variant="bodyS" tone="accent">
              {comparacao ? "Com esta compra" : "Saldo projetado"}
            </Text>
          </Inline>
          <Money
            value={current.saldo}
            size="xl"
            tone={current.saldo < 0 ? "negative" : "neutral"}
          />
          {comparacao && (
            <ValueRow label="Sem esta compra" value={before.saldo} />
          )}
          <ForecastChart
            points={base}
            comparison={comparacao ?? undefined}
            selected={Math.min(selected, base.length - 1)}
            onSelect={setSelected}
          />
          {current.primeiroAperto && (
            <Text
              variant="bodyS"
              tone="danger"
            >{`Pode faltar saldo em ${dataCurta(current.primeiroAperto, language)} antes das próximas entradas.`}</Text>
          )}
        </Stack>
        <Stack
          gap="lg"
          style={{
            padding: 22,
            borderRadius: 28,
            backgroundColor: color.feature.slateSurface,
          }}
        >
          <Inline justify="space-between">
            <Heading level="m">Simular uma compra</Heading>
            <Ionicons
              name="calculator-outline"
              size={24}
              color={color.feature.slateInk}
            />
          </Inline>
          <Field
            numeric
            label="Valor total (R$)"
            value={valor}
            onChange={setValor}
            placeholder="0,00"
          />
          <Inline gap="sm">
            {[300, 800, 1500].map((v) => (
              <Pressable
                key={v}
                accessibilityRole="button"
                accessibilityLabel={`${language === "en-US" ? "Simulate" : "Simular"} R$ ${v}`}
                onPress={() => setValor(`${v},00`)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  alignItems: "center",
                  borderRadius: 12,
                  backgroundColor: color.feature.blueSurface,
                }}
              >
                <Text variant="bodyS">R$ {v}</Text>
              </Pressable>
            ))}
          </Inline>
          <Choices
            items={[
              { label: "À vista", value: "avista" },
              ...estado.cartoes.map((c) => ({ label: c.nome, value: c.id })),
            ]}
            value={forma}
            onChange={(v) => {
              setForma(v);
              setSelected(0);
            }}
          />
          {cartao && (
            <Stack gap="md">
              <Field
                numeric
                label="Número de parcelas (1 a 60)"
                value={parcelas}
                onChange={setParcelas}
              />
              <Choices
                items={[1, 3, 6, 12].map((n) => ({
                  label: `${n}x`,
                  value: String(n),
                }))}
                value={parcelas}
                onChange={setParcelas}
              />
              <Text variant="bodyS" tone="secondary">
                Primeira fatura estimada: {nomeMes(primeira, false, language)}
              </Text>
            </Stack>
          )}
          {valor && !valido && (
            <Text tone="danger">
              Confira o valor e as parcelas. Use vírgula nos centavos e parcelas
              de 1 a 60.
            </Text>
          )}
          {comparacao && (
            <Inline
              align="flex-start"
              style={{
                padding: 16,
                borderRadius: 18,
                backgroundColor: color.feature.blueSurface,
              }}
            >
              <Ionicons
                name={
                  limiteExcedido || riscos.length
                    ? "alert-outline"
                    : "checkmark-outline"
                }
                size={24}
                color={
                  limiteExcedido || riscos.length
                    ? color.state.danger
                    : color.text.accent
                }
              />
              <Stack gap="xs" style={{ flex: 1 }}>
                <Text variant="bodyBoldM">
                  {limiteExcedido
                    ? "Limite estimado excedido"
                    : riscos.length
                      ? "Atenção ao saldo futuro"
                      : "Previsão acima de zero"}
                </Text>
                <Text variant="bodyS" tone="secondary">
                  {riscos.length
                    ? `${riscos.length} mês(es) com saldo negativo em algum ponto da projeção.`
                    : "Estimativa baseada nos registros."}
                </Text>
              </Stack>
            </Inline>
          )}
          <Text variant="bodyS" tone="secondary">
            Simulação · nada é salvo
          </Text>
        </Stack>
        <Inline
          style={{
            padding: 22,
            borderRadius: 24,
            backgroundColor: color.feature.blueSurface,
          }}
          justify="space-between"
        >
          <Stack gap="sm">
            <Text variant="bodyS" tone="secondary">
              Reserva mensal
            </Text>
            <Money value={estado.reservaMensal} size="m" />
          </Stack>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Alterar reserva mensal"
            onPress={() => setForm({ tipo: "reserva" })}
            style={{ padding: 12 }}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={color.text.accent}
            />
          </Pressable>
        </Inline>
      </Stack>
      {form && <FinanceForm target={form} onClose={() => setForm(null)} />}
    </Screen>
  );
}
