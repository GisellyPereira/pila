const API_BASE_URL = "http://10.25.0.123:3000";

export type Mensagem = {
  autor: "user" | "jota";
  texto: string;
};

export async function perguntarJota(
  mensagem: string,
  historico: Mensagem[] = [],
): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/jota/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensagem, historico }),
  });

  if (!res.ok) {
    throw new Error(`Jota travou (HTTP ${res.status})`);
  }

  const data = (await res.json()) as { resposta?: string; erro?: string };
  if (data.erro) throw new Error(data.erro);
  if (!data.resposta) throw new Error("Resposta vazia");
  return data.resposta;
}
