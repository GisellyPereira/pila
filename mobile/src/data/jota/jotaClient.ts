import type { Transacao } from "@/src/domain/Transacao";
import { formatBRL } from "@/src/shared/utils/formatBRL";

const API_BASE_URL = process.env.EXPO_PUBLIC_JOTA_API_URL?.replace(/\/$/, "");
export type Mensagem = { autor: "user" | "jota"; texto: string };
type Contexto = { transacoes: Transacao[]; saldo: number; respeito: number };

export async function perguntarJota(mensagem: string, historico: Mensagem[] = [], contexto?: Contexto): Promise<string> {
  if (!API_BASE_URL) {
    const texto = mensagem.toLowerCase();
    const now = new Date();
    const doMes = (contexto?.transacoes ?? []).filter((t) => {
      const d = new Date(t.data);
      return t.tipo === "saida" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    if (/delivery|ifood|comida|pedir/.test(texto)) {
      const total = doMes.filter((t) => t.categoria === "delivery").reduce((sum, t) => sum + Math.round(t.valor * 100), 0) / 100;
      return total > 0 ? `${formatBRL(total)} em delivery neste mês. O fogão tá pedindo uma audiência. Olha o saldo antes de pedir de novo.` : "Nenhum delivery registrado neste mês. Se tiver arroz em casa, o Jota já sabe qual é a defesa.";
    }
    if (/cofre|guardar|reserva|econom/.test(texto)) return `Seu saldo no mês é ${formatBRL(contexto?.saldo ?? 0)}. Dá uma olhada nas metas do Cofre e decide quanto consegue separar sem apertar o mês.`;
    if (/respeito|nível|nivel|miss/.test(texto)) return `${contexto?.respeito ?? 0} de Respeito. Gastos anotados valem 10; resistir ao impulso vale 50 por dia. O Jota contabiliza o juízo.`;
    if (/compr|promo|shopee|tênis|tenis/.test(texto)) return "Antes de fechar o carrinho: você queria isso antes da promoção? Se a resposta for não, o botão ‘Eu resisti’ tá bem ali.";
    return `Seu saldo no mês é ${formatBRL(contexto?.saldo ?? 0)}. Me pergunta sobre delivery, compras, Respeito ou sua reserva. Esses autos eu conheço.`;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(`${API_BASE_URL}/jota/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ mensagem, historico, perfilUsuario: contexto ? { saldo: contexto.saldo, respeito: contexto.respeito } : undefined }) });
    if (!res.ok) throw new Error(`Jota travou (HTTP ${res.status})`);
    const data = await res.json() as { resposta?: string; erro?: string };
    if (data.erro || !data.resposta) throw new Error(data.erro ?? "Resposta vazia");
    return data.resposta;
  } finally { clearTimeout(timeout); }
}
