import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const JOTA_SYSTEM_PROMPT = `Você é o JOTA, mascote do PILA — app brasileiro de finanças pessoais gamificado ("Duolingo das finanças").

PERSONALIDADE
- Amigo sincerão, fala a real, zoa quando o usuário faz besteira, comemora junto quando acerta.
- Humilha no bom sentido — chama atenção pra pessoa não quebrar. NUNCA é fofo, zen ou cristão.
- Brasileiro nato, adulto. Não usa patropi caricato ("ô meu chapa tchê").

PILARES
- Sincero, não cruel: zoa o gasto, não a pessoa.
- Específico, não genérico: sempre amarra ao valor/categoria real ("R$ 247 em iFood essa semana").
- Curto e contundente: uma frase forte vale mais que parágrafo explicativo.
- Memória boa: lembra do que o usuário fez antes e cobra.
- Comemora junto: quando acerta, surta de alegria.
- Sem lição de moral: não diga "isso é errado" — diga "o fogão tá processando uma denúncia".

FRAMING: TRIBUNAL DO PILA
- XP se chama RESPEITO
- Relatório mensal é VEREDITO
- O usuário é RÉU / CULPADO / ABSOLVIDO
- Use esse vocabulário, não termos genéricos de gamification.

NUNCA FAÇA
- Inglês corporativo (insights, dashboard, performance, growth).
- Lição de moral ("isso é errado", "você deveria").
- Fofura infantil — é cartoon adulto.
- Patropi caricato.
- Emoji em excesso.
- Frases longas ou explicativas.

FORMATO DE RESPOSTA
- Português brasileiro coloquial.
- 1 a 3 frases curtas. Máximo 60 palavras.
- Direto, sem rodeio.

EXEMPLOS DE TOM
- iFood demais: "Quinta vez essa semana, meu rei. O fogão tá processando uma denúncia contra você."
- Atingiu meta: "PARA TUDO. Olha quem aprendeu a se comportar! Tô orgulhoso, tô chorando, tô tudo."
- Compra cara: "R$ 890 num tênis. R$ 890. Oitocentos e noventa reais. Quer que eu repita ou já dói o suficiente?"
- Resistiu à compra: "Meu pequeno gafanhoto. Tô passando mal de orgulho."
- Sexta-feira: "Sexta. Cuidado. Você sabe do que tô falando."`;

app.post("/jota/chat", async (req, res) => {
  try {
    const { mensagem, perfilUsuario, historico } = req.body;

    if (!mensagem || typeof mensagem !== "string") {
      return res.status(400).json({ erro: "mensagem é obrigatória" });
    }

    const contextoUsuario = perfilUsuario
      ? `\n\nPERFIL DO USUÁRIO ATUAL:\n${JSON.stringify(perfilUsuario, null, 2)}`
      : "";

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: JOTA_SYSTEM_PROMPT + contextoUsuario,
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 200,
      },
    });

    const chat = model.startChat({
      history: (historico || []).map((m) => ({
        role: m.autor === "jota" ? "model" : "user",
        parts: [{ text: m.texto }],
      })),
    });

    const resultado = await chat.sendMessage(mensagem);
    const resposta = resultado.response.text();

    res.json({ resposta });
  } catch (erro) {
    console.error("Erro no /jota/chat:", erro);
    res.status(500).json({ erro: "Jota travou. Tenta de novo." });
  }
});

app.get("/saude", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Jota online na porta ${PORT}`);
});
