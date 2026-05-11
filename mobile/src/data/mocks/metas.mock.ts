import type { Meta } from "@/src/domain/Meta";

export const METAS_MOCK: Meta[] = [
  {
    id: "g1",
    nome: "Reserva de emergência",
    valorAtual: 1240,
    valorAlvo: 6000,
    emoji: "🆘",
  },
  {
    id: "g2",
    nome: "Viagem em julho",
    valorAtual: 480,
    valorAlvo: 2500,
    emoji: "✈️",
  },
  {
    id: "g3",
    nome: "Curso de inglês",
    valorAtual: 320,
    valorAlvo: 800,
    emoji: "📚",
  },
];

export const RESUMO_MES_MOCK = {
  entradas: 4200,
  saidas: 3853,
  sobrou: 347,
  respeito: 425,
};
