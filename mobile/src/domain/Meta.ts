export type Meta = {
  id: string;
  nome: string;
  valorAtual: number;
  valorAlvo: number;
  prazo?: string;
  emoji?: string;
};

export function progressoMeta({ valorAtual, valorAlvo }: Meta): number {
  if (valorAlvo <= 0) return 0;
  return Math.min(1, Math.max(0, valorAtual / valorAlvo));
}
