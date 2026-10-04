import { diaLocal } from "./Carteira";

export type Receita = {
  id: string;
  nome: string;
  valor: number;
  dia: number;
  inicio: string;
};
export type Conta = {
  id: string;
  nome: string;
  valor: number;
  dia: number;
  tipo: "fixa" | "variavel" | "parcelada";
  inicio: string;
  parcelas: number;
  revisoes?: { mes: string; valor: number; dia: number }[];
};
export type Cartao = {
  id: string;
  nome: string;
  limite: number;
  fechamento: number;
  vencimento: number;
  inicio: string;
};
export type Compra = {
  id: string;
  cartaoId: string;
  nome: string;
  total: number;
  parcelas: number;
  data: string;
  primeiraFatura: string;
  faturaImportada?: boolean;
  categoria?: string;
};
export type Movimento = {
  id: string;
  descricao: string;
  categoria?: string;
  valor: number;
  tipo: "entrada" | "saida";
  data: string;
  origem: "avulsa" | "receita" | "conta" | "cartao" | "reserva";
  referencia?: string;
  competencia?: string;
  incluidoNoSaldoInicial?: boolean;
};
export type Financas = {
  version: 2;
  exemplo: boolean;
  configurado: boolean;
  saldoInicial: number;
  dataSaldo: string;
  reservaMensal: number;
  receitas: Receita[];
  contas: Conta[];
  cartoes: Cartao[];
  compras: Compra[];
  movimentos: Movimento[];
};
export type Evento = {
  chave: string;
  nome: string;
  data: string;
  valor: number;
  tipo: "entrada" | "saida";
  origem: "receita" | "conta" | "cartao" | "reserva";
  referencia: string;
  competencia: string;
};

export const centavos = (valor: number) => Math.round(valor * 100);
export const mesAtual = (data = new Date()) => diaLocal(data).slice(0, 7);
export function somarMes(mes: string, quantidade: number): string {
  const [ano, numero] = mes.split("-").map(Number);
  return mesAtual(new Date(ano, numero - 1 + quantidade, 1, 12));
}
export function distanciaMes(inicio: string, fim: string): number {
  const [a, m] = inicio.split("-").map(Number);
  const [b, n] = fim.split("-").map(Number);
  return (b - a) * 12 + n - m;
}
export function dataVencimento(mes: string, dia: number): string {
  const [ano, numero] = mes.split("-").map(Number);
  const ultimo = new Date(ano, numero, 0).getDate();
  return `${mes}-${String(Math.min(dia, ultimo)).padStart(2, "0")}`;
}
export function diaConta(conta: Conta, mes: string): number {
  return (
    [...(conta.revisoes ?? [])]
      .filter((r) => r.mes <= mes)
      .sort((a, b) => b.mes.localeCompare(a.mes))[0]?.dia ?? conta.dia
  );
}
export function valorConta(conta: Conta, mes: string): number {
  const offset = distanciaMes(conta.inicio, mes);
  return offset < 0 ||
    (conta.tipo === "variavel" && offset !== 0) ||
    (conta.tipo === "parcelada" && offset >= conta.parcelas)
    ? 0
    : ([...(conta.revisoes ?? [])]
        .filter((r) => r.mes <= mes)
        .sort((a, b) => b.mes.localeCompare(a.mes))[0]?.valor ?? conta.valor);
}
export function parcelaCompra(compra: Compra, mes: string): number {
  const offset = distanciaMes(compra.primeiraFatura, mes);
  if (offset < 0 || offset >= compra.parcelas) return 0;
  const total = centavos(compra.total);
  const base = Math.floor(total / compra.parcelas);
  return (
    (offset === compra.parcelas - 1
      ? total - base * (compra.parcelas - 1)
      : base) / 100
  );
}
export function primeiraFatura(cartao: Cartao, data: string): string {
  // Compras no dia do fechamento são provisionadas para o ciclo seguinte.
  const mes = data.slice(0, 7);
  const aposFechamento =
    Number(data.slice(8, 10)) >=
    Number(dataVencimento(mes, cartao.fechamento).slice(8));
  const fechamento = somarMes(mes, aposFechamento ? 1 : 0);
  return somarMes(fechamento, cartao.vencimento <= cartao.fechamento ? 1 : 0);
}
export function valorFatura(
  estado: Financas,
  cartaoId: string,
  mes: string,
): number {
  const compras = estado.compras.filter((c) => c.cartaoId === cartaoId);
  const detalhado = compras
    .filter((c) => !c.faturaImportada)
    .reduce((total, c) => total + centavos(parcelaCompra(c, mes)), 0);
  // Um total informado é referência da fatura, nunca uma segunda compra.
  const informado = compras
    .filter((c) => c.faturaImportada)
    .reduce((maior, c) => Math.max(maior, centavos(parcelaCompra(c, mes))), 0);
  return Math.max(detalhado, informado) / 100;
}
export function pago(
  estado: Financas,
  origem: Movimento["origem"],
  referencia: string,
  mes: string,
): number {
  return (
    estado.movimentos
      .filter(
        (m) =>
          m.origem === origem &&
          m.referencia === referencia &&
          m.competencia === mes,
      )
      .reduce((total, m) => total + centavos(m.valor), 0) / 100
  );
}
export function saldoAtual(estado: Financas): number {
  return (
    (centavos(estado.saldoInicial) +
      estado.movimentos
        .filter((m) => !m.incluidoNoSaldoInicial)
        .reduce(
          (total, m) =>
            total + (m.tipo === "entrada" ? 1 : -1) * centavos(m.valor),
          0,
        )) /
    100
  );
}
export function limiteDisponivel(estado: Financas, cartao: Cartao): number {
  const meses = new Set<string>();
  estado.compras
    .filter((c) => c.cartaoId === cartao.id)
    .forEach((c) => {
      for (let i = 0; i < c.parcelas; i++)
        meses.add(somarMes(c.primeiraFatura, i));
    });
  const pendente = [...meses].reduce(
    (total, mes) => total + centavos(valorFatura(estado, cartao.id, mes)),
    0,
  );
  const pagos = estado.movimentos
    .filter((m) => m.origem === "cartao" && m.referencia === cartao.id)
    .reduce((total, m) => total + centavos(m.valor), 0);
  return (centavos(cartao.limite) - Math.max(0, pendente - pagos)) / 100;
}
export function resumoPlanejado(estado: Financas, mes: string) {
  const doMes = estado.movimentos.filter((m) => m.data.slice(0, 7) === mes);
  const renda =
    estado.receitas
      .filter((r) => r.inicio <= mes)
      .reduce(
        (sum, r) =>
          sum + centavos(pago(estado, "receita", r.id, mes) || r.valor),
        0,
      ) +
    doMes
      .filter((m) => m.origem === "avulsa" && m.tipo === "entrada")
      .reduce((sum, m) => sum + centavos(m.valor), 0);
  const receitasSemCadastro = estado.movimentos
    .filter(
      (m) =>
        m.origem === "receita" &&
        m.competencia === mes &&
        !estado.receitas.some((r) => r.id === m.referencia && r.inicio <= mes),
    )
    .reduce((sum, m) => sum + centavos(m.valor), 0);
  const contasSemCadastro = estado.movimentos
    .filter(
      (m) =>
        m.origem === "conta" &&
        m.competencia === mes &&
        !estado.contas.some((c) => c.id === m.referencia),
    )
    .reduce((sum, m) => sum + centavos(m.valor), 0);
  const fixas = estado.contas
    .filter((c) => c.tipo === "fixa")
    .reduce(
      (sum, c) =>
        sum +
        centavos(
          Math.max(valorConta(c, mes), pago(estado, "conta", c.id, mes)),
        ),
      0,
    );
  const outras = estado.contas
    .filter((c) => c.tipo !== "fixa")
    .reduce(
      (sum, c) =>
        sum +
        centavos(
          Math.max(valorConta(c, mes), pago(estado, "conta", c.id, mes)),
        ),
      0,
    );
  const cartoes = estado.cartoes.reduce(
    (sum, c) =>
      sum +
      centavos(
        Math.max(
          valorFatura(estado, c.id, mes),
          pago(estado, "cartao", c.id, mes),
        ),
      ),
    0,
  );
  const avulsas = doMes
    .filter((m) => m.origem === "avulsa" && m.tipo === "saida")
    .reduce((sum, m) => sum + centavos(m.valor), 0);
  const reservado = estado.movimentos
    .filter(
      (m) =>
        m.origem === "reserva" && (m.competencia ?? m.data.slice(0, 7)) === mes,
    )
    .reduce((sum, m) => sum + centavos(m.valor), 0);
  const reserva = Math.max(reservado, centavos(estado.reservaMensal));
  const comprometido = fixas + outras + contasSemCadastro + cartoes + avulsas;
  return {
    renda: (renda + receitasSemCadastro) / 100,
    fixas: fixas / 100,
    outras: (outras + contasSemCadastro) / 100,
    cartoes: cartoes / 100,
    avulsas: avulsas / 100,
    reserva: reserva / 100,
    comprometido: comprometido / 100,
    sobra: (renda + receitasSemCadastro - comprometido - reserva) / 100,
  };
}
export function eventosDoMes(estado: Financas, mes: string): Evento[] {
  const eventos: Evento[] = [];
  estado.receitas
    .filter((r) => r.inicio <= mes)
    .forEach((r) => {
      const valor =
        Math.max(
          0,
          centavos(r.valor) - centavos(pago(estado, "receita", r.id, mes)),
        ) / 100;
      if (valor)
        eventos.push({
          chave: `receita-${r.id}-${mes}`,
          nome: r.nome,
          data: dataVencimento(mes, r.dia),
          valor,
          tipo: "entrada",
          origem: "receita",
          referencia: r.id,
          competencia: mes,
        });
    });
  estado.contas.forEach((c) => {
    const valor =
      Math.max(
        0,
        centavos(valorConta(c, mes)) -
          centavos(pago(estado, "conta", c.id, mes)),
      ) / 100;
    if (valor)
      eventos.push({
        chave: `conta-${c.id}-${mes}`,
        nome: c.nome,
        data: dataVencimento(mes, diaConta(c, mes)),
        valor,
        tipo: "saida",
        origem: "conta",
        referencia: c.id,
        competencia: mes,
      });
  });
  estado.cartoes.forEach((c) => {
    const valor =
      Math.max(
        0,
        centavos(valorFatura(estado, c.id, mes)) -
          centavos(pago(estado, "cartao", c.id, mes)),
      ) / 100;
    if (valor)
      eventos.push({
        chave: `cartao-${c.id}-${mes}`,
        nome: `Fatura · ${c.nome}`,
        data: dataVencimento(mes, c.vencimento),
        valor,
        tipo: "saida",
        origem: "cartao",
        referencia: c.id,
        competencia: mes,
      });
  });
  const reservado = estado.movimentos
    .filter(
      (m) =>
        m.origem === "reserva" && (m.competencia ?? m.data.slice(0, 7)) === mes,
    )
    .reduce((sum, m) => sum + centavos(m.valor), 0);
  const reserva = Math.max(0, centavos(estado.reservaMensal) - reservado) / 100;
  if (reserva)
    eventos.push({
      chave: `reserva-${mes}`,
      nome: "Reserva planejada",
      data: dataVencimento(mes, 31),
      valor: reserva,
      tipo: "saida",
      origem: "reserva",
      referencia: "reserva",
      competencia: mes,
    });
  return eventos.sort(
    (a, b) =>
      a.data.localeCompare(b.data) ||
      (a.tipo === b.tipo ? 0 : a.tipo === "saida" ? -1 : 1),
  );
}
function pendenciasAnteriores(estado: Financas, mes: string): Evento[] {
  const meses = [
    ...estado.contas.map((c) => c.inicio),
    ...estado.compras.map((c) => c.primeiraFatura),
  ]
    .filter((m) => m < mes)
    .sort();
  if (!meses.length) return [];
  const total = distanciaMes(meses[0], mes);
  return Array.from({ length: total }, (_, i) =>
    eventosDoMes(estado, somarMes(meses[0], i)),
  )
    .flat()
    .filter((e) => e.tipo === "saida" && e.origem !== "reserva");
}
export function previsao(estado: Financas, quantidade = 6, hoje = diaLocal()) {
  const inicio = hoje.slice(0, 7);
  let saldo = centavos(saldoAtual(estado));
  const atrasadas = pendenciasAnteriores(estado, inicio);
  saldo -= atrasadas.reduce((sum, e) => sum + centavos(e.valor), 0);
  return Array.from({ length: quantidade }, (_, i) => {
    const mes = somarMes(inicio, i);
    const eventos = eventosDoMes(estado, mes);
    let menorSaldo = saldo;
    let primeiroAperto: string | null = saldo < 0 ? hoje : null;
    const agenda = eventos.map((e) => {
      saldo += (e.tipo === "entrada" ? 1 : -1) * centavos(e.valor);
      if (saldo < menorSaldo) menorSaldo = saldo;
      if (saldo < 0 && !primeiroAperto)
        primeiroAperto = e.data < hoje ? hoje : e.data;
      return { ...e, saldoApos: saldo / 100 };
    });
    return {
      mes,
      saldo: saldo / 100,
      menorSaldo: menorSaldo / 100,
      primeiroAperto,
      agenda,
    };
  });
}
export function ateProximaReceita(estado: Financas, hoje = diaLocal()) {
  const inicio = hoje.slice(0, 7);
  const agendas = Array.from({ length: 3 }, (_, i) =>
    eventosDoMes(estado, somarMes(inicio, i)),
  ).flat();
  const receita = agendas
    .filter((e) => e.tipo === "entrada" && e.data > hoje)
    .sort((a, b) => a.data.localeCompare(b.data))[0];
  const ate = receita?.data ?? dataVencimento(inicio, 31);
  const atrasadas = pendenciasAnteriores(estado, inicio);
  const compromissos = [
    ...atrasadas,
    ...agendas.filter((e) => e.tipo === "saida" && e.data <= ate),
  ];
  const valor =
    compromissos.reduce((sum, e) => sum + centavos(e.valor), 0) / 100;
  const livre = (centavos(saldoAtual(estado)) - centavos(valor)) / 100;
  const [a, m, d] = hoje.split("-").map(Number);
  const [b, n, f] = ate.split("-").map(Number);
  const dias = Math.max(
    1,
    Math.round((Date.UTC(b, n - 1, f) - Date.UTC(a, m - 1, d)) / 86400000),
  );
  return {
    receita,
    ate,
    dias,
    comprometido: valor,
    livre,
    porDia: Math.floor((Math.max(0, livre) * 100) / dias) / 100,
  };
}
export function vazio(): Financas {
  return {
    version: 2,
    exemplo: false,
    configurado: false,
    saldoInicial: 0,
    dataSaldo: diaLocal(),
    reservaMensal: 0,
    receitas: [],
    contas: [],
    cartoes: [],
    compras: [],
    movimentos: [],
  };
}
export function exemplo(): Financas {
  const mes = mesAtual();
  return {
    ...vazio(),
    exemplo: true,
    configurado: true,
    saldoInicial: 1850,
    reservaMensal: 300,
    receitas: [
      { id: "salario", nome: "Salário", valor: 4800, dia: 5, inicio: mes },
    ],
    contas: [
      {
        id: "aluguel",
        nome: "Aluguel",
        valor: 1450,
        dia: 8,
        tipo: "fixa",
        inicio: mes,
        parcelas: 1,
      },
      {
        id: "internet",
        nome: "Internet",
        valor: 99.9,
        dia: 20,
        tipo: "fixa",
        inicio: mes,
        parcelas: 1,
      },
      {
        id: "luz",
        nome: "Energia elétrica",
        valor: 180,
        dia: 15,
        tipo: "variavel",
        inicio: mes,
        parcelas: 1,
      },
      {
        id: "emprestimo",
        nome: "Empréstimo pessoal",
        valor: 320,
        dia: 10,
        tipo: "parcelada",
        inicio: mes,
        parcelas: 8,
      },
    ],
    cartoes: [
      {
        id: "principal",
        nome: "Cartão principal",
        limite: 6000,
        fechamento: 5,
        vencimento: 12,
        inicio: mes,
      },
    ],
    compras: [
      {
        id: "notebook",
        cartaoId: "principal",
        nome: "Notebook",
        categoria: "Compras",
        total: 2400,
        parcelas: 6,
        data: diaLocal(),
        primeiraFatura: mes,
      },
      {
        id: "mercado",
        cartaoId: "principal",
        nome: "Mercado",
        categoria: "Alimentação",
        total: 428.6,
        parcelas: 1,
        data: diaLocal(),
        primeiraFatura: mes,
      },
    ],
  };
}
