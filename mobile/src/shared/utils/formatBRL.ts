const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

const formatterCompact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function formatBRL(value: number, compact = false): string {
  return compact ? formatterCompact.format(value) : formatter.format(value);
}
