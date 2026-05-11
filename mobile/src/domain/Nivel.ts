export type Nivel = {
  id: number;
  nome: string;
  descricao: string;
  respeitoMinimo: number;
};

export const NIVEIS: readonly Nivel[] = [
  { id: 1, nome: "Mendigo do PIX", descricao: "Saldo no zero, esperança no chão.", respeitoMinimo: 0 },
  { id: 2, nome: "Boleto Atrasado", descricao: "Lembra do boleto depois que vence.", respeitoMinimo: 50 },
  { id: 3, nome: "Conta-Salário", descricao: "Recebe e gasta no mesmo dia.", respeitoMinimo: 150 },
  { id: 4, nome: "Pé de Meia", descricao: "Tem uma graninha guardada — começo.", respeitoMinimo: 350 },
  { id: 5, nome: "Investidor de Boteco", descricao: "Já fala em CDB no churrasco.", respeitoMinimo: 700 },
  { id: 6, nome: "CDB Caseiro", descricao: "Renda fixa virou rotina.", respeitoMinimo: 1200 },
  { id: 7, nome: "Bolsa de Valores", descricao: "Diversificou. Cabeça fria.", respeitoMinimo: 2000 },
  { id: 8, nome: "Magnata do Bairro", descricao: "O bairro já te respeita.", respeitoMinimo: 3500 },
  { id: 9, nome: "Empresário Suspeito", descricao: "Tá grande demais pra esse app.", respeitoMinimo: 5500 },
  { id: 10, nome: "Lobo de Wall Street do Brás", descricao: "Lenda viva. Helicóptero atrás.", respeitoMinimo: 9000 },
] as const;

export function nivelPorRespeito(respeito: number): Nivel {
  return [...NIVEIS].reverse().find((n) => respeito >= n.respeitoMinimo) ?? NIVEIS[0];
}

export function proximoNivel(respeito: number): Nivel | null {
  return NIVEIS.find((n) => respeito < n.respeitoMinimo) ?? null;
}
