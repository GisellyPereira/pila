import type { Transacao } from "./Transacao";

export function diaLocal(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function resumoMes(transacoes: Transacao[], date = new Date()) {
  const doMes = transacoes.filter((t) => {
    const d = new Date(t.data);
    return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
  });
  const centavos = (tipo: Transacao["tipo"]) => doMes
    .filter((t) => t.tipo === tipo).reduce((total, t) => total + Math.round(t.valor * 100), 0);
  const entradas = centavos("entrada");
  const saidas = centavos("saida");
  return { entradas: entradas / 100, saidas: saidas / 100, sobrou: (entradas - saidas) / 100 };
}

export function lerValor(texto: string): number | null {
  const normalized = texto.trim().replace(/\s|R\$/g, "");
  if (!/^(\d{1,3}(\.\d{3})*|\d+)(,\d{1,2})?$/.test(normalized)) return null;
  const valor = Number(normalized.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(valor) && valor > 0 && valor <= 999999.99 ? valor : null;
}
