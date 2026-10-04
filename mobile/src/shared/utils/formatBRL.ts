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

const english = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});
const englishCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function formatBRL(
  value: number,
  compact = false,
  locale = "pt-BR",
): string {
  if (locale === "en-US")
    return compact ? englishCompact.format(value) : english.format(value);
  return compact ? formatterCompact.format(value) : formatter.format(value);
}
