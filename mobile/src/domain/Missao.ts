export type DificuldadeMissao = "facil" | "media" | "dificil";

export type Missao = {
  id: string;
  titulo: string;
  descricao: string;
  porqueImporta: string;
  dificuldade: DificuldadeMissao;
  recompensaRespeito: number;
  prazo: "diaria" | "semanal" | "mensal";
  concluida: boolean;
};

export const DIFICULDADE_LABEL: Record<DificuldadeMissao, string> = {
  facil: "Fácil",
  media: "Média",
  dificil: "Difícil",
};
