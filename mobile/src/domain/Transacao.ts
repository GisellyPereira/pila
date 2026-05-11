export type CategoriaTransacao =
  | "delivery"
  | "transporte"
  | "lazer"
  | "mercado"
  | "moradia"
  | "saude"
  | "educacao"
  | "salario"
  | "investimento"
  | "outros";

export type TagEmocional = "essencial" | "superfluo" | "arrependido" | "merecido";

export type Transacao = {
  id: string;
  descricao: string;
  valor: number;
  tipo: "saida" | "entrada";
  categoria: CategoriaTransacao;
  tag?: TagEmocional;
  data: string;
  comentarioJota?: string;
};

export const CATEGORIA_LABEL: Record<CategoriaTransacao, string> = {
  delivery: "Delivery",
  transporte: "Transporte",
  lazer: "Lazer",
  mercado: "Mercado",
  moradia: "Moradia",
  saude: "Saúde",
  educacao: "Educação",
  salario: "Salário",
  investimento: "Investimento",
  outros: "Outros",
};

export const TAG_LABEL: Record<TagEmocional, string> = {
  essencial: "Essencial",
  superfluo: "Supérfluo",
  arrependido: "Arrependido",
  merecido: "Mereci",
};
