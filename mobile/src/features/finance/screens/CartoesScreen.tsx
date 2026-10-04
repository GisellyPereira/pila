import { useReducedMotion } from "@/src/shared/hooks/useReducedMotion";
import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, View } from "react-native";
import { usePila } from "@/src/app/providers/PilaProvider";
import {
  distanciaMes,
  limiteDisponivel,
  parcelaCompra,
  valorFatura,
} from "@/src/domain/Planejamento";
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
import { RegisterSheet } from "../components/RegisterSheet";
import { CategoryOverview, categoryIcons } from "../components/VisualFinance";
import { FinanceForm, type FormTarget } from "../components/FinanceForm";
import {
  Choices,
  MonthPicker,
  ValueRow,
  dataCurta,
} from "../components/FinanceUI";
export default function CartoesScreen() {
  const { color, language, t } = usePreferences();
  const statementTones = ["blue", "slate", "rose"] as const;

  const { estado, mes } = usePila();
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef<ScrollView>(null);
  const [stackY, setStackY] = useState(0);
  const [listY, setListY] = useState(0);
  const [register, setRegister] = useState<"all" | "credit" | null>(null);
  const [category, setCategory] = useState("todos");
  const [receipt, setReceipt] = useState<string | null>(null);
  const [detailForm, setDetailForm] = useState<FormTarget | null>(null);
  const [form, setForm] = useState<FormTarget | null>(null);
  const [filtro, setFiltro] = useState("todos");
  const [cartaoId, setCartaoId] = useState("todos");
  const [limite, setLimite] = useState(20);
  useEffect(() => {
    setLimite(20);
    setCategory("todos");
  }, [mes, filtro, cartaoId]);
  const [detalhe, setDetalhe] = useState<string | null>(null);
  const cartao = estado.cartoes.find((c) => c.id === detalhe);
  const registros = useMemo(() => {
    const credito = estado.compras
      .filter(
        (c) =>
          !c.faturaImportada &&
          c.data.slice(0, 7) === mes &&
          (cartaoId === "todos" || c.cartaoId === cartaoId),
      )
      .map((c) => ({
        id: c.id,
        nome: c.nome,
        data: c.data,
        valor: c.total,
        categoria: c.categoria ?? "Sem categoria",
        compra: c,
        detalhe: `${estado.cartoes.find((card) => card.id === c.cartaoId)?.nome ?? "Cartão"} · ${c.parcelas === 1 ? "Uma parcela" : `${c.parcelas} parcelas`} · Primeira fatura ${c.primeiraFatura.slice(5)}/${c.primeiraFatura.slice(0, 4)}`,
      }));
    const avista = estado.movimentos
      .filter(
        (m) =>
          m.origem === "avulsa" &&
          m.tipo === "saida" &&
          m.data.slice(0, 7) === mes,
      )
      .map((m) => ({
        id: m.id,
        nome: m.descricao,
        data: m.data,
        valor: m.valor,
        categoria: m.categoria ?? "Sem categoria",
        compra: undefined,
        detalhe: "À vista · saída registrada",
      }));
    return [
      ...(filtro !== "avista" ? credito : []),
      ...(filtro !== "credito" ? avista : []),
    ].sort((a, b) => b.data.localeCompare(a.data));
  }, [estado, mes, filtro, cartaoId]);
  const total =
    registros.reduce((s, r) => s + Math.round(r.valor * 100), 0) / 100;
  const categorias = useMemo(() => {
    const grupos = new Map<string, number>();
    registros.forEach((r) =>
      grupos.set(
        r.categoria,
        (grupos.get(r.categoria) ?? 0) + Math.round(r.valor * 100),
      ),
    );
    return [...grupos].sort((a, b) => b[1] - a[1]);
  }, [registros]);
  const shown =
    category === "todos"
      ? registros
      : registros.filter((r) => r.categoria === category);
  const selectedReceipt = registros.find((r) => r.id === receipt);
  return (
    <Screen scroll scrollRef={scrollRef}>
      <PageTitle
        title="Gastos"
        description="Valor integral das compras realizadas no período. Contas e pagamentos de faturas ficam na Agenda."
        aside={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("Registrar um gasto")}
            onPress={() => setRegister("all")}
            style={{
              padding: 12,
              borderRadius: 14,
              backgroundColor: color.action.primary,
            }}
          >
            <Ionicons name="add" size={24} color={color.action.text} />
          </Pressable>
        }
      />
      <MonthPicker />
      <Stack gap="xl" onLayout={(e) => setStackY(e.nativeEvent.layout.y)}>
        <Choices
          items={[
            { label: "Todos", value: "todos" },
            { label: "À vista", value: "avista" },
            { label: "No crédito", value: "credito" },
          ]}
          value={filtro}
          onChange={setFiltro}
        />
        {filtro !== "avista" && estado.cartoes.length > 1 && (
          <Choices
            items={[
              { label: "Todos os cartões", value: "todos" },
              ...estado.cartoes.map((c) => ({ label: c.nome, value: c.id })),
            ]}
            value={cartaoId}
            onChange={setCartaoId}
          />
        )}
        <Stack
          gap="md"
          style={{
            padding: 24,
            borderRadius: 28,
            backgroundColor: color.feature.roseStrong,
          }}
        >
          <Text variant="bodyS" style={{ color: color.feature.roseMuted }}>
            {filtro === "credito"
              ? "Compras no crédito neste mês"
              : filtro === "avista"
                ? "Gastos à vista neste mês"
                : "Compras do período"}
          </Text>
          <Money
            value={total}
            size="xl"
            style={{ color: color.feature.roseText }}
          />
          <Inline justify="space-between">
            <Text variant="bodyS" style={{ color: color.feature.roseMuted }}>
              {registros.length}{" "}
              <Text style={{ color: color.feature.roseMuted }} variant="bodyS">
                registros
              </Text>
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setRegister("all")}
              style={{ paddingVertical: 8 }}
            >
              <Text
                variant="bodyBoldM"
                style={{ color: color.feature.roseText }}
              >
                Registrar
              </Text>
            </Pressable>
          </Inline>
        </Stack>
        {categorias.length > 0 && (
          <Stack gap="lg">
            <Heading level="m">Onde você gastou</Heading>
            <CategoryOverview
              groups={categorias}
              total={total}
              selected={category}
              onSelect={(value) => {
                setCategory(value);
                setLimite(20);
                requestAnimationFrame(() =>
                  scrollRef.current?.scrollTo({
                    y: stackY + listY - 12,
                    animated: !reducedMotion,
                  }),
                );
              }}
            />
          </Stack>
        )}
        <Stack gap="md" onLayout={(e) => setListY(e.nativeEvent.layout.y)}>
          <Inline justify="space-between">
            <Heading level="m">
              {category === "todos" ? "Compras do período" : category}
            </Heading>
            {category !== "todos" && (
              <Pressable
                accessibilityRole="button"
                onPress={() => setCategory("todos")}
                style={{ padding: 8 }}
              >
                <Text variant="bodyS" tone="accent">
                  Limpar filtro
                </Text>
              </Pressable>
            )}
          </Inline>
          {shown.slice(0, limite).map((r) => (
            <Pressable
              key={r.id}
              accessibilityRole="button"
              accessibilityLabel={`${t("Ver registro")}: ${r.nome}`}
              onPress={() =>
                r.compra
                  ? setForm({ tipo: "compra", item: r.compra })
                  : setReceipt(r.id)
              }
              style={{
                padding: 16,
                borderRadius: 20,
                backgroundColor: color.bg.surface,
              }}
            >
              <Inline>
                <Ionicons
                  name={categoryIcons[r.categoria] ?? "pricetag-outline"}
                  size={23}
                  color={color.text.accent}
                />
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Text variant="bodyBoldM" translatable={false}>
                    {r.nome}
                  </Text>
                  <Text variant="bodyS" tone="secondary">
                    {dataCurta(r.data, language)} ·{" "}
                    {r.compra ? "No crédito" : "À vista"}
                  </Text>
                </Stack>
                <Money value={r.valor} size="m" />
              </Inline>
            </Pressable>
          ))}
          {shown.length > limite && (
            <Button
              label="Mostrar mais compras"
              variant="secondary"
              size="md"
              onPress={() => setLimite((n) => n + 20)}
            />
          )}
          {!registros.length && (
            <Stack
              gap="lg"
              style={{
                padding: 24,
                borderRadius: 24,
                backgroundColor: color.bg.surface,
              }}
            >
              <Heading level="m">Sua primeira compra</Heading>
              <Text tone="secondary">Escolha como você pagou.</Text>
              <Button
                label="Registrar um gasto"
                onPress={() => setRegister("all")}
              />
            </Stack>
          )}
        </Stack>
        {filtro !== "avista" && (
          <Stack gap="lg">
            <Inline justify="space-between">
              <Heading level="m">Faturas do mês</Heading>
              <Pressable
                accessibilityRole="button"
                onPress={() => setForm({ tipo: "cartao" })}
                style={{ paddingVertical: 12 }}
              >
                <Text variant="bodyS" tone="accent">
                  Novo cartão
                </Text>
              </Pressable>
            </Inline>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {estado.cartoes
                .filter((c) => cartaoId === "todos" || c.id === cartaoId)
                .map((c) => {
                  const tone =
                    statementTones[
                      estado.cartoes.indexOf(c) % statementTones.length
                    ];
                  const ink = color.feature[`${tone}Text`];
                  const muted = color.feature[`${tone}Muted`];
                  return (
                    <Pressable
                      key={c.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${t("Ver fatura")}: ${c.nome}`}
                      onPress={() => setDetalhe(c.id)}
                      style={{
                        width: 210,
                        padding: 20,
                        borderRadius: 24,
                        backgroundColor: color.feature[`${tone}Strong`],
                        gap: 14,
                      }}
                    >
                      <Inline justify="space-between">
                        <Ionicons name="card-outline" size={24} color={ink} />
                        <Text variant="bodyS" style={{ color: muted }}>
                          {c.vencimento}/{mes.slice(5)}
                        </Text>
                      </Inline>
                      <Text
                        variant="bodyBoldM"
                        translatable={false}
                        style={{ color: ink }}
                      >
                        {c.nome}
                      </Text>
                      <Money
                        value={valorFatura(estado, c.id, mes)}
                        size="l"
                        style={{ color: ink }}
                      />
                      <Text variant="bodyS" style={{ color: ink }}>
                        Ver fatura
                      </Text>
                    </Pressable>
                  );
                })}
            </ScrollView>
          </Stack>
        )}
      </Stack>
      <Sheet
        visible={!!cartao}
        translateTitle={!!detailForm || !cartao}
        title={
          detailForm
            ? detailForm.tipo === "cartao"
              ? "Editar cartão"
              : "Editar registro no crédito"
            : (cartao?.nome ?? "Fatura")
        }
        onClose={() => {
          setDetalhe(null);
          setDetailForm(null);
        }}
      >
        {detailForm ? (
          <FinanceForm
            key={detailForm.tipo}
            embedded
            target={detailForm}
            onClose={() => {
              setDetailForm(null);
              setDetalhe(null);
            }}
          />
        ) : (
          cartao && (
            <Stack gap="xl">
              <ValueRow
                label="Fatura do mês selecionado"
                value={valorFatura(estado, cartao.id, mes)}
              />
              <Text tone="secondary">
                Fecha dia {cartao.fechamento} · vence dia {cartao.vencimento}.
              </Text>
              {estado.compras
                .filter(
                  (c) =>
                    c.cartaoId === cartao.id &&
                    !c.faturaImportada &&
                    parcelaCompra(c, mes) > 0,
                )
                .map((c) => (
                  <Stack key={c.id} gap="xs">
                    <ValueRow
                      label={c.nome}
                      translateLabel={false}
                      value={parcelaCompra(c, mes)}
                    />
                    <Text variant="bodyS" tone="secondary">
                      Parcela {distanciaMes(c.primeiraFatura, mes) + 1} de{" "}
                      {c.parcelas}
                    </Text>
                  </Stack>
                ))}
              {estado.compras
                .filter(
                  (c) =>
                    c.cartaoId === cartao.id &&
                    c.faturaImportada &&
                    parcelaCompra(c, mes) > 0,
                )
                .map((c) => (
                  <Stack key={c.id} gap="sm">
                    <ValueRow
                      label="Total de fatura informado"
                      value={parcelaCompra(c, mes)}
                    />
                    <Button
                      label="Editar total informado"
                      variant="secondary"
                      size="sm"
                      onPress={() => {
                        setDetailForm({ tipo: "compra", item: c });
                      }}
                    />
                  </Stack>
                ))}
              <Text variant="bodyS" tone="secondary">
                O total informado e as compras detalhadas não são somados. A
                previsão usa o maior valor para evitar duplicidade.
              </Text>
              <ValueRow
                label="Limite estimado disponível"
                value={limiteDisponivel(estado, cartao)}
              />
              <Text variant="bodyS" tone="secondary">
                Confira o limite real no banco. O Pila usa apenas os registros
                cadastrados.
              </Text>
              <Button
                label="Editar dados do cartão"
                variant="secondary"
                onPress={() => {
                  setDetailForm({ tipo: "cartao", item: cartao });
                }}
              />
              <Button
                label="Registrar compra ou total da fatura"
                onPress={() => {
                  setDetailForm({ tipo: "compra", cartaoId: cartao.id });
                }}
              />
            </Stack>
          )
        )}
      </Sheet>
      <Sheet
        visible={!!selectedReceipt}
        title="Gasto à vista"
        onClose={() => setReceipt(null)}
      >
        {selectedReceipt && (
          <Stack gap="lg">
            <Text variant="displayM" translatable={false}>
              {selectedReceipt.nome}
            </Text>
            <Money value={selectedReceipt.valor} size="xl" />
            <Text tone="secondary">{selectedReceipt.categoria}</Text>
            <Text tone="secondary">
              {dataCurta(selectedReceipt.data, language)}
            </Text>
            <Text variant="bodyS" tone="secondary">
              Pagamento registrado no saldo.
            </Text>
          </Stack>
        )}
      </Sheet>
      {register && (
        <RegisterSheet
          credit={register === "credit"}
          onClose={() => setRegister(null)}
        />
      )}
      {form && <FinanceForm target={form} onClose={() => setForm(null)} />}
    </Screen>
  );
}
