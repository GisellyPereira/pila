import { useFeedback } from "@/src/shared/feedback/FeedbackProvider";
import { Brand } from "@/src/shared/components/jota/Brand";
import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { Sheet } from "@/src/shared/components/primitives/Sheet";
import { Button, Money, Stack, Text } from "@/src/shared/components/primitives";

import { diaLocal } from "@/src/domain/Carteira";
import {
  eventosDoMes,
  exemplo,
  mesAtual,
  pago,
  somarMes,
  vazio,
  type Financas,
  type Receita,
  type Conta,
  type Cartao,
  type Compra,
  type Movimento,
  type Evento,
} from "@/src/domain/Planejamento";

const KEY = "pila:planejamento:v2";
const novoId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const valorValido = (v: number) =>
  Number.isFinite(v) && v > 0 && v <= 999999.99;
const diaValido = (d: number) => Number.isInteger(d) && d >= 1 && d <= 31;
const mesValido = (m: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(m);

type Pila = {
  estado: Financas;
  mes: string;
  storageError: boolean;
  setMes: (mes: string) => void;
  configurar: (
    salario: number,
    dia: number,
    saldo: number,
    recebido: boolean,
  ) => void;
  salvarReceita: (receita: Omit<Receita, "id"> & { id?: string }) => boolean;
  salvarConta: (conta: Omit<Conta, "id"> & { id?: string }) => boolean;
  salvarCartao: (cartao: Omit<Cartao, "id"> & { id?: string }) => boolean;
  salvarCompra: (compra: Omit<Compra, "id"> & { id?: string }) => boolean;
  registrar: (
    movimento: Pick<Movimento, "descricao" | "valor" | "tipo" | "categoria">,
  ) => boolean;
  confirmar: (evento: Evento) => void;
  definirReserva: (valor: number) => void;
  ajustarSaldo: (saldo: number) => void;
  reiniciar: () => void;
  carregarExemplo: () => void;
  remover: (
    tipo: "receita" | "conta" | "cartao" | "compra",
    id: string,
  ) => boolean;
};
const Context = createContext<Pila | null>(null);

function validar(raw: string): Financas {
  const value = JSON.parse(raw) as Financas;
  if (
    value.version !== 2 ||
    !Number.isFinite(value.saldoInicial) ||
    !Number.isFinite(value.reservaMensal) ||
    value.reservaMensal < 0 ||
    !Array.isArray(value.receitas) ||
    !Array.isArray(value.contas) ||
    !Array.isArray(value.cartoes) ||
    !Array.isArray(value.compras) ||
    !Array.isArray(value.movimentos)
  )
    throw new Error("Dados inválidos");
  if (
    !value.receitas.every(
      (r) =>
        r &&
        typeof r.id === "string" &&
        typeof r.nome === "string" &&
        valorValido(r.valor) &&
        diaValido(r.dia) &&
        mesValido(r.inicio),
    ) ||
    !value.contas.every(
      (c) =>
        c &&
        typeof c.id === "string" &&
        typeof c.nome === "string" &&
        valorValido(c.valor) &&
        diaValido(c.dia) &&
        mesValido(c.inicio) &&
        ["fixa", "variavel", "parcelada"].includes(c.tipo) &&
        Number.isInteger(c.parcelas) &&
        c.parcelas >= 1 &&
        (c.revisoes === undefined ||
          (Array.isArray(c.revisoes) &&
            c.revisoes.every(
              (r) =>
                r &&
                mesValido(r.mes) &&
                valorValido(r.valor) &&
                diaValido(r.dia),
            ))),
    ) ||
    !value.cartoes.every(
      (c) =>
        c &&
        typeof c.id === "string" &&
        typeof c.nome === "string" &&
        valorValido(c.limite) &&
        diaValido(c.fechamento) &&
        diaValido(c.vencimento) &&
        mesValido(c.inicio),
    ) ||
    !value.compras.every(
      (c) =>
        c &&
        typeof c.id === "string" &&
        typeof c.nome === "string" &&
        typeof c.cartaoId === "string" &&
        (c.categoria === undefined || typeof c.categoria === "string") &&
        valorValido(c.total) &&
        Number.isInteger(c.parcelas) &&
        c.parcelas >= 1 &&
        c.parcelas <= 60 &&
        centavosSuficientes(c.total, c.parcelas) &&
        mesValido(c.primeiraFatura),
    ) ||
    !value.movimentos.every(
      (m) =>
        m &&
        typeof m.id === "string" &&
        typeof m.descricao === "string" &&
        (m.categoria === undefined || typeof m.categoria === "string") &&
        valorValido(m.valor) &&
        ["entrada", "saida"].includes(m.tipo) &&
        ["avulsa", "receita", "conta", "cartao", "reserva"].includes(
          m.origem,
        ) &&
        /^\d{4}-\d{2}-\d{2}$/.test(m.data),
    )
  )
    throw new Error("Registros inválidos");
  return value;
}
function centavosSuficientes(total: number, parcelas: number) {
  return Math.round(total * 100) >= parcelas;
}

export function PilaProvider({ children }: { children: React.ReactNode }) {
  const { color } = usePreferences();
  const { notify } = useFeedback();

  const [estado, setEstado] = useState<Financas>(vazio);
  const [mes, setMes] = useState(mesAtual);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [confirmEvent, setConfirmEvent] = useState<Evento | null>(null);
  const [incluido, setIncluido] = useState(false);
  const blocked = useRef(false);
  const fila = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const dados = validar(raw);
        if (active) setEstado(dados);
        return;
      }
      const legacy = await AsyncStorage.getItem("pila:carteira:v1");
      if (!legacy) return;
      const anterior = JSON.parse(legacy) as {
        exemplo?: boolean;
        transacoes?: {
          id: string;
          descricao: string;
          valor: number;
          tipo: "entrada" | "saida";
          data: string;
        }[];
      };
      const movimentos: Movimento[] = (anterior.transacoes ?? [])
        .filter((t) => anterior.exemplo === false || !/^t[1-7]$/.test(t.id))
        .filter(
          (t) =>
            typeof t.descricao === "string" &&
            valorValido(t.valor) &&
            ["entrada", "saida"].includes(t.tipo) &&
            Number.isFinite(new Date(t.data).getTime()),
        )
        .map((t) => ({
          id: t.id,
          descricao: t.descricao,
          valor: t.valor,
          tipo: t.tipo,
          data: diaLocal(new Date(t.data)),
          origem: "avulsa",
        }));
      if (active && movimentos.length) setEstado({ ...vazio(), movimentos });
    })()
      .catch(() => {
        if (active) {
          blocked.current = true;
          setStorageError(true);
        }
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!ready || blocked.current) return;
    fila.current = fila.current
      .then(() => AsyncStorage.setItem(KEY, JSON.stringify(estado)))
      .then(() => setStorageError(false))
      .catch(() => setStorageError(true));
  }, [estado, ready]);

  function configurar(
    salario: number,
    dia: number,
    saldo: number,
    recebido: boolean,
  ) {
    if (!valorValido(salario) || !diaValido(dia) || !Number.isFinite(saldo))
      return;
    const receitaId =
      estado.receitas.find((r) => r.nome.trim().toLowerCase() === "salário")
        ?.id ?? novoId();
    setEstado((prev) => ({
      ...prev,
      configurado: true,
      exemplo: false,
      saldoInicial: saldo,
      dataSaldo: diaLocal(),
      receitas: [
        ...prev.receitas.filter((r) => r.id !== receitaId),
        {
          id: receitaId,
          nome: "Salário",
          valor: salario,
          dia,
          inicio: mesAtual(),
        },
      ],
      movimentos: [
        ...prev.movimentos.map((m) => ({ ...m, incluidoNoSaldoInicial: true })),
        ...(recebido
          ? [
              {
                id: novoId(),
                descricao: "Salário já recebido",
                valor: salario,
                tipo: "entrada" as const,
                data: diaLocal(),
                origem: "receita" as const,
                referencia: receitaId,
                competencia: mesAtual(),
                incluidoNoSaldoInicial: true,
              },
            ]
          : []),
      ],
    }));
  }
  function salvarReceita(r: Omit<Receita, "id"> & { id?: string }) {
    if (
      !r.nome.trim() ||
      !valorValido(r.valor) ||
      !diaValido(r.dia) ||
      !mesValido(r.inicio)
    )
      return false;
    setEstado((p) => ({
      ...p,
      receitas: r.id
        ? p.receitas.map((i) => (i.id === r.id ? { ...r, id: r.id! } : i))
        : [...p.receitas, { ...r, id: novoId() }],
    }));
    return true;
  }
  function salvarConta(c: Omit<Conta, "id"> & { id?: string }) {
    if (
      !c.nome.trim() ||
      !valorValido(c.valor) ||
      !diaValido(c.dia) ||
      !mesValido(c.inicio) ||
      !Number.isInteger(c.parcelas) ||
      c.parcelas < 1 ||
      c.parcelas > 120
    )
      return false;
    setEstado((p) => ({
      ...p,
      contas: c.id
        ? p.contas.map((i) =>
            i.id !== c.id
              ? i
              : i.tipo === "fixa" && c.tipo === "fixa"
                ? {
                    ...i,
                    nome: c.nome,
                    revisoes: [
                      ...(i.revisoes ?? []).filter((r) => r.mes !== c.inicio),
                      { mes: c.inicio, valor: c.valor, dia: c.dia },
                    ],
                  }
                : { ...c, id: c.id! },
          )
        : [...p.contas, { ...c, id: novoId() }],
    }));
    return true;
  }
  function salvarCartao(c: Omit<Cartao, "id"> & { id?: string }) {
    if (
      !c.nome.trim() ||
      !valorValido(c.limite) ||
      !diaValido(c.fechamento) ||
      !diaValido(c.vencimento) ||
      !mesValido(c.inicio)
    )
      return false;
    setEstado((p) => ({
      ...p,
      cartoes: c.id
        ? p.cartoes.map((i) => (i.id === c.id ? { ...c, id: c.id! } : i))
        : [...p.cartoes, { ...c, id: novoId() }],
    }));
    return true;
  }
  function salvarCompra(c: Omit<Compra, "id"> & { id?: string }) {
    if (
      !c.nome.trim() ||
      !valorValido(c.total) ||
      !Number.isInteger(c.parcelas) ||
      c.parcelas < 1 ||
      c.parcelas > 60 ||
      !centavosSuficientes(c.total, c.parcelas) ||
      !mesValido(c.primeiraFatura) ||
      !estado.cartoes.some((card) => card.id === c.cartaoId)
    )
      return false;
    setEstado((p) => ({
      ...p,
      compras: c.id
        ? p.compras.map((i) => (i.id === c.id ? { ...c, id: c.id! } : i))
        : [...p.compras, { ...c, id: novoId() }],
    }));
    return true;
  }
  function registrar(
    m: Pick<Movimento, "descricao" | "valor" | "tipo" | "categoria">,
  ) {
    if (!m.descricao.trim() || !valorValido(m.valor)) return false;
    setEstado((p) => ({
      ...p,
      movimentos: [
        { ...m, id: novoId(), data: diaLocal(), origem: "avulsa" },
        ...p.movimentos,
      ],
    }));
    return true;
  }
  function aplicarEvento(evento: Evento) {
    setEstado((p) => {
      const atual = eventosDoMes(p, evento.competencia).find(
        (e) => e.chave === evento.chave,
      );
      if (!atual) return p;
      return {
        ...p,
        movimentos: [
          {
            id: novoId(),
            descricao: atual.nome,
            valor: atual.valor,
            tipo: atual.tipo,
            data: diaLocal(),
            origem: atual.origem,
            referencia: atual.referencia,
            competencia: atual.competencia,
            incluidoNoSaldoInicial: incluido,
          },
          ...p.movimentos,
        ],
      };
    });
    setConfirmEvent(null);
  }
  function remover(
    tipo: "receita" | "conta" | "cartao" | "compra",
    id: string,
  ) {
    if (tipo === "cartao" && estado.compras.some((c) => c.cartaoId === id))
      return false;
    if (tipo === "compra") {
      const compra = estado.compras.find((c) => c.id === id);
      if (
        compra &&
        Array.from({ length: compra.parcelas }, (_, i) =>
          pago(
            estado,
            "cartao",
            compra.cartaoId,
            somarMes(compra.primeiraFatura, i),
          ),
        ).some((v) => v > 0)
      )
        return false;
    }
    setEstado((p) => ({
      ...p,
      receitas:
        tipo === "receita" ? p.receitas.filter((r) => r.id !== id) : p.receitas,
      contas: tipo === "conta" ? p.contas.filter((c) => c.id !== id) : p.contas,
      cartoes:
        tipo === "cartao" ? p.cartoes.filter((c) => c.id !== id) : p.cartoes,
      compras:
        tipo === "compra" ? p.compras.filter((c) => c.id !== id) : p.compras,
    }));
    return true;
  }
  const value: Pila = {
    estado,
    mes,
    storageError,
    setMes,
    configurar,
    salvarReceita,
    salvarConta,
    salvarCartao,
    salvarCompra,
    registrar,
    confirmar: (e) => {
      setConfirmEvent(e);
      setIncluido(false);
    },
    remover,
    definirReserva: (v) => {
      if (Number.isFinite(v) && v >= 0)
        setEstado((p) => ({ ...p, reservaMensal: v }));
    },
    ajustarSaldo: (v) => {
      if (Number.isFinite(v))
        setEstado((p) => ({
          ...p,
          saldoInicial: v,
          dataSaldo: diaLocal(),
          movimentos: p.movimentos.map((m) => ({
            ...m,
            incluidoNoSaldoInicial: true,
          })),
        }));
    },
    reiniciar: () => {
      blocked.current = false;
      setEstado(vazio());
      setMes(mesAtual());
    },
    carregarExemplo: () => {
      blocked.current = false;
      setEstado(exemplo());
      setMes(mesAtual());
    },
  };
  if (!ready)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: color.bg.app,
        }}
      >
        <Brand width={180} />
      </View>
    );
  return (
    <Context.Provider value={value}>
      {children}
      <Sheet
        visible={!!confirmEvent}
        title={
          confirmEvent?.tipo === "entrada"
            ? "Registrar recebimento"
            : "Registrar pagamento"
        }
        onClose={() => setConfirmEvent(null)}
      >
        <Stack gap="xl">
          <Text variant="bodyBoldM" translatable={false}>
            {confirmEvent?.nome}
          </Text>
          <Money value={confirmEvent?.valor ?? 0} size="l" />
          <Text>
            Confirme somente quando o dinheiro tiver entrado ou o pagamento
            tiver sido feito. Este registro atualiza seu saldo no Pila.
          </Text>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: incluido }}
            onPress={() => setIncluido(!incluido)}
          >
            <Text variant="bodyBoldM">
              {incluido ? "☑" : "☐"} O valor já está refletido no saldo
              informado
            </Text>
          </Pressable>
          <Text variant="bodyS" tone="secondary">
            Marque ao cadastrar algo que já aconteceu antes de informar ou
            atualizar seu saldo. Assim, esse valor não é somado ou descontado
            novamente.
          </Text>
          <Button
            label="Confirmar registro"
            onPress={() => {
              if (confirmEvent) {
                aplicarEvento(confirmEvent);
                notify(
                  confirmEvent.tipo === "entrada"
                    ? "Recebimento registrado"
                    : "Pagamento registrado",
                );
              }
            }}
          />
          <Button
            label="Voltar"
            variant="secondary"
            onPress={() => setConfirmEvent(null)}
          />
        </Stack>
      </Sheet>
    </Context.Provider>
  );
}
export function usePila() {
  const value = useContext(Context);
  if (!value) throw new Error("usePila precisa de PilaProvider");
  return value;
}
