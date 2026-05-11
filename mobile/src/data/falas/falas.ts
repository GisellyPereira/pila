export const falasHome: string[] = [
  "Bom dia. Hoje a gente economiza ou hoje a gente chora? Você decide.",
  "Acorda, vagabundo financeiro. Tem grana pra contar.",
  "Café da manhã pago em casa? Já começou bem o dia.",
  "Fim do dia. Vamos ver o estrago.",
  "Sexta. Cuidado. Você sabe do que tô falando.",
  "Já registrou os gastos? Não me obriga ir aí.",
  "Tá pensando em pedir iFood, né? EU SEI.",
];

export function falaDoDia(): string {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return falasHome[dayOfYear % falasHome.length];
}
