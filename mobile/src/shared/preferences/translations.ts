import english from "./en.json";
const dictionary: Record<string, string> = english;
export function translate(text: string, language: string): string {
  if (language !== "en-US") return text;
  const key = text.replace(/\s+/g, " ").trim();
  if (dictionary[key]) {
    const before = /^\s/.test(text) ? " " : "",
      after = /\s$/.test(text) ? " " : "";
    return before + dictionary[key] + after;
  }
  return text
    .replace(/^(\d+) dias até (.+)\.$/, "$1 days until $2.")
    .replace(/ · Primeira fatura /g, " · First statement ")
    .replace(/ · Uma parcela/g, " · One installment")
    .replace(/(\d+) parcelas/g, "$1 installments")
    .replace(/^Parcela (\d+)\/(\d+)$/, "Installment $1/$2")
    .replace(/^(\d+) parcelas$/, "$1 installments")
    .replace(/^(\d+) dias até (.+), em (.+)\.$/, "$1 days until $2, on $3.")
    .replace(
      /^Pode faltar saldo em (.+) antes das próximas entradas\.$/,
      "Your balance may fall below zero on $1 before your next income.",
    )
    .replace(
      /^(\d+) mês\(es\) com saldo negativo em algum ponto da projeção\.$/,
      "$1 month(s) with a negative balance at some point in the forecast.",
    )
    .replace(
      /^Começa em (.+)\. Confira com o seu banco; é possível ajustar este mês manualmente\.$/,
      "Starts in $1. Check with your bank; you can adjust this month manually.",
    );
}
