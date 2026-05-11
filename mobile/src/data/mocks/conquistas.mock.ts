import type { Conquista } from "@/src/domain/Conquista";

export const CONQUISTAS_MOCK: Conquista[] = [
  {
    id: "c1",
    nome: "Primeiro Não pro iFood",
    descricao: "Resistiu uma vez. Já é vitória.",
    desbloqueada: true,
    dataDesbloqueio: "2026-04-12",
  },
  {
    id: "c2",
    nome: "Sobrevivente do Dia 25",
    descricao: "Passou do dia 25 sem cheque especial.",
    desbloqueada: true,
    dataDesbloqueio: "2026-04-26",
  },
  {
    id: "c3",
    nome: "Resistiu à Shopee",
    descricao: "Fechou o carrinho. Salvou o mês.",
    desbloqueada: false,
  },
  {
    id: "c4",
    nome: "Economizei e Não Falei pra Ninguém",
    descricao: "Discrição é uma virtude.",
    desbloqueada: true,
    dataDesbloqueio: "2026-05-02",
  },
  {
    id: "c5",
    nome: "Boleto Pago no Prazo",
    descricao: "Sem multa, sem juros, sem stress.",
    desbloqueada: true,
    dataDesbloqueio: "2026-05-10",
  },
  {
    id: "c6",
    nome: "Mês Sem Uber",
    descricao: "Pernas funcionam. Quem diria.",
    desbloqueada: false,
  },
  {
    id: "c7",
    nome: "Disse Não pra Promoção",
    descricao: "Promoção não é dinheiro economizado se você não precisava.",
    desbloqueada: false,
  },
  {
    id: "c8",
    nome: "Falei 'Tô Sem' pro Amigo",
    descricao: "Recusou o rolê caro. Coragem.",
    desbloqueada: false,
  },
];
