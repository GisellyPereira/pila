import type { Missao } from "@/src/domain/Missao";

export const MISSOES_MOCK: Missao[] = [
  {
    id: "m1",
    titulo: "Anota TODO gasto até sábado",
    descricao: "Sem pular nenhum. Nem o cafezinho.",
    porqueImporta:
      "Você não controla o que não mede. A maioria dos furos no orçamento são os 'gastinhos' invisíveis.",
    dificuldade: "facil",
    recompensaRespeito: 15,
    prazo: "semanal",
    concluida: false,
  },
  {
    id: "m2",
    titulo: "Cozinhe 3x essa semana",
    descricao: "Pode ser miojo turbinado, vale.",
    porqueImporta:
      "Separar algumas refeições da semana ajuda a perceber quanto você gasta por conveniência. O Jota aceita até arroz com ovo.",
    dificuldade: "media",
    recompensaRespeito: 30,
    prazo: "semanal",
    concluida: false,
  },
  {
    id: "m3",
    titulo: "Não pede delivery na quarta",
    descricao: "Quarta é dia de teste de fé.",
    porqueImporta:
      "Quebrar a inércia em um dia já reduz o automatismo. Hábito quebra hábito.",
    dificuldade: "facil",
    recompensaRespeito: 10,
    prazo: "semanal",
    concluida: true,
  },
  {
    id: "m4",
    titulo: "Compara 2 preços antes de comprar",
    descricao: "Vale pra qualquer compra acima de R$ 50.",
    porqueImporta:
      "Comparar o mesmo produto antes de comprar dá tempo para pensar e pode revelar um preço melhor.",
    dificuldade: "media",
    recompensaRespeito: 20,
    prazo: "semanal",
    concluida: false,
  },
  {
    id: "m5",
    titulo: "Guarda R$ 50 no Cofre",
    descricao: "Sem mexer até o fim do mês.",
    porqueImporta:
      "A reserva de emergência é o que separa um susto de uma dívida. Começar com pouco já cria o hábito.",
    dificuldade: "facil",
    recompensaRespeito: 25,
    prazo: "semanal",
    concluida: false,
  },
  {
    id: "m6",
    titulo: "Passa do dia 25 sem cheque especial",
    descricao: "Sobrevivente do fim do mês.",
    porqueImporta:
      "Conhecer o saldo e os gastos do mês ajuda a perceber o aperto antes de entrar no limite da conta.",
    dificuldade: "dificil",
    recompensaRespeito: 60,
    prazo: "mensal",
    concluida: false,
  },
];
