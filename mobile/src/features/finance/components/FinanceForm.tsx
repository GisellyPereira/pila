import { useFeedback } from "@/src/shared/feedback/FeedbackProvider";
import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { useState } from "react";
import { Pressable } from "react-native";
import { usePila } from "@/src/app/providers/PilaProvider";
import { diaLocal, lerValor } from "@/src/domain/Carteira";
import {
  diaConta,
  valorConta,
  mesAtual,
  primeiraFatura,
  type Receita,
  type Conta,
  type Cartao,
  type Compra,
} from "@/src/domain/Planejamento";
import { Sheet } from "@/src/shared/components/primitives/Sheet";
import { Button, Stack, Text } from "@/src/shared/components/primitives";
import { Choices, Field, nomeMes } from "./FinanceUI";

type FormTarget =
  | { tipo: "configurar" | "movimento" | "reserva" | "saldo" }
  | { tipo: "receita"; item?: Receita }
  | { tipo: "conta"; item?: Conta }
  | { tipo: "cartao"; item?: Cartao }
  | { tipo: "compra"; cartaoId?: string; item?: Compra };
export type { FormTarget };
const dinheiro = (v: number) => v.toFixed(2).replace(".", ",");
function dinheiroLivre(texto: string): number | null {
  if (/^0(?:,0{1,2})?$/.test(texto.trim())) return 0;
  if (texto.trim().startsWith("-")) {
    const value = lerValor(texto.trim().slice(1));
    return value === null ? null : -value;
  }
  return lerValor(texto);
}
const diaOk = (s: string) =>
  /^\d{1,2}$/.test(s) && Number(s) >= 1 && Number(s) <= 31;
const mesOk = (s: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(s);
function dataOk(s: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])-\d{2}$/.test(s)) return false;
  const [a, m, d] = s.split("-").map(Number);
  return diaLocal(new Date(a, m - 1, d, 12)) === s;
}
export function FinanceForm({
  target,
  onClose,
  embedded = false,
}: {
  target: FormTarget;
  onClose: () => void;
  embedded?: boolean;
}) {
  const { language } = usePreferences();
  const { notify } = useFeedback();

  const pila = usePila();
  const item = "item" in target ? target.item : undefined;
  const [nome, setNome] = useState(item?.nome ?? "");
  const [valor, setValor] = useState(
    item && "valor" in item
      ? dinheiro(
          "tipo" in item
            ? valorConta(item, pila.mes) || item.valor
            : item.valor,
        )
      : item && "limite" in item
        ? dinheiro(item.limite)
        : item && "total" in item
          ? dinheiro(item.total)
          : target.tipo === "reserva"
            ? dinheiro(pila.estado.reservaMensal)
            : "",
  );
  const [dia, setDia] = useState(
    item && "dia" in item
      ? String("tipo" in item ? diaConta(item, pila.mes) : item.dia)
      : "5",
  );
  const [inicio, setInicio] = useState(
    target.tipo === "conta" && target.item?.tipo === "fixa"
      ? pila.mes
      : item && "inicio" in item
        ? item.inicio
        : pila.mes,
  );
  const [tipoConta, setTipoConta] = useState<Conta["tipo"]>(
    item && "tipo" in item ? item.tipo : "fixa",
  );
  const [parcelas, setParcelas] = useState(
    item && "parcelas" in item ? String(item.parcelas) : "1",
  );
  const [fechamento, setFechamento] = useState(
    item && "fechamento" in item ? String(item.fechamento) : "5",
  );
  const [vencimento, setVencimento] = useState(
    item && "vencimento" in item ? String(item.vencimento) : "12",
  );
  const [saldo, setSaldo] = useState("0,00");
  const [recebido, setRecebido] = useState(false);
  const [movimento, setMovimento] = useState<"entrada" | "saida">("saida");
  const [cartaoId, setCartaoId] = useState(
    target.tipo === "compra"
      ? (target.item?.cartaoId ??
          target.cartaoId ??
          pila.estado.cartoes[0]?.id ??
          "")
      : "",
  );
  const cartao = pila.estado.cartoes.find((c) => c.id === cartaoId);
  const [data, setData] = useState(
    item && "data" in item ? item.data : diaLocal(),
  );
  const [fatura, setFatura] = useState(
    item && "primeiraFatura" in item
      ? item.primeiraFatura
      : cartao
        ? primeiraFatura(cartao, diaLocal())
        : pila.mes,
  );
  const [categoria, setCategoria] = useState(
    item && "categoria" in item
      ? (item.categoria ?? "Sem categoria")
      : "Sem categoria",
  );
  const [details, setDetails] = useState(
    Boolean(item && "faturaImportada" in item && item.faturaImportada),
  );
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [erro, setErro] = useState("");
  const [excluir, setExcluir] = useState(false);
  const [modoCompra, setModoCompra] = useState(
    item && "faturaImportada" in item && item.faturaImportada
      ? "fatura"
      : "compra",
  );
  const titles = {
    configurar: "Vamos organizar seu mês",
    receita: item ? "Editar receita" : "Nova receita",
    conta: item ? "Editar conta" : "Nova conta",
    cartao: item ? "Editar cartão" : "Novo cartão",
    compra: item ? "Editar registro no crédito" : "Registrar compra no crédito",
    movimento: "Registrar movimentação",
    reserva: "Sua reserva mensal",
    saldo: "Atualizar saldo disponível",
  };
  function salvar() {
    setErro("");
    const amount = ["reserva", "saldo"].includes(target.tipo)
      ? dinheiroLivre(valor)
      : lerValor(valor);
    if (amount === null || (target.tipo === "reserva" && amount < 0)) {
      setErro("Informe um valor válido, como 1.500,00.");
      return;
    }
    let ok = true;
    if (
      ["receita", "conta", "cartao", "compra", "movimento"].includes(
        target.tipo,
      ) &&
      !nome.trim()
    ) {
      setErro("Preencha o nome ou a descrição.");
      return;
    }
    if (
      ["receita", "conta", "configurar"].includes(target.tipo) &&
      !diaOk(dia)
    ) {
      setErro("O dia precisa estar entre 1 e 31.");
      return;
    }
    if (
      ["receita", "conta", "cartao"].includes(target.tipo) &&
      !mesOk(inicio)
    ) {
      setErro("Use ano e mês no formato 2026-10.");
      return;
    }
    switch (target.tipo) {
      case "configurar": {
        const current = dinheiroLivre(saldo);
        if (current === null) {
          setErro("Informe o saldo atual, inclusive se for zero ou negativo.");
          return;
        }
        pila.configurar(amount, Number(dia), current, recebido);
        break;
      }
      case "receita":
        ok = pila.salvarReceita({
          id: target.item?.id,
          nome: nome.trim(),
          valor: amount,
          dia: Number(dia),
          inicio,
        });
        break;
      case "conta":
        if (
          tipoConta === "parcelada" &&
          (!/^\d+$/.test(parcelas) ||
            Number(parcelas) < 1 ||
            Number(parcelas) > 120)
        ) {
          setErro("Informe de 1 a 120 parcelas restantes.");
          return;
        }
        ok = pila.salvarConta({
          id: target.item?.id,
          nome: nome.trim(),
          valor: amount,
          dia: Number(dia),
          inicio,
          tipo: tipoConta,
          parcelas: tipoConta === "parcelada" ? Number(parcelas) : 1,
        });
        break;
      case "cartao":
        if (!diaOk(fechamento) || !diaOk(vencimento)) {
          setErro("Fechamento e vencimento precisam estar entre 1 e 31.");
          return;
        }
        ok = pila.salvarCartao({
          id: target.item?.id,
          nome: nome.trim(),
          limite: amount,
          fechamento: Number(fechamento),
          vencimento: Number(vencimento),
          inicio,
        });
        break;
      case "compra":
        if (
          !cartao ||
          !dataOk(data) ||
          !mesOk(fatura) ||
          !/^\d+$/.test(parcelas) ||
          Number(parcelas) < 1 ||
          Number(parcelas) > 60
        ) {
          setErro(
            "Confira o cartão, a data, a primeira fatura e as parcelas (1 a 60).",
          );
          return;
        }
        ok = pila.salvarCompra({
          id: target.item?.id,
          cartaoId,
          faturaImportada: modoCompra === "fatura",
          nome: nome.trim(),
          total: amount,
          categoria,
          parcelas: Number(parcelas),
          data,
          primeiraFatura: fatura,
        });
        break;
      case "movimento":
        ok = pila.registrar({
          descricao: nome.trim(),
          categoria,
          valor: amount,
          tipo: movimento,
        });
        break;
      case "reserva":
        pila.definirReserva(amount);
        break;
      case "saldo":
        pila.ajustarSaldo(amount);
        break;
    }
    if (!ok) {
      setErro(
        "Confira os valores antes de salvar. As parcelas precisam ter pelo menos um centavo.",
      );
      return;
    }
    notify("Registro salvo");
    onClose();
  }
  const content = (
    <Stack gap="xl">
      {target.tipo === "compra" && details && (
        <>
          <Choices
            items={[
              { label: "Compra", value: "compra" },
              { label: "Fatura existente", value: "fatura" },
            ]}
            value={modoCompra}
            onChange={(v) => {
              setModoCompra(v);
              if (v === "fatura") {
                setParcelas("1");
                setFatura(pila.mes);
                if (!nome) setNome("Fatura já existente");
              } else if (nome === "Fatura já existente") setNome("");
            }}
          />
          <Text variant="bodyS" tone="secondary">
            {modoCompra === "fatura"
              ? "Cadastre o total de uma fatura que já existe no seu banco. O total não é somado às compras detalhadas: a previsão considera o maior valor."
              : "Informe o valor total e as parcelas da compra. Cada parcela entra no mês correspondente."}
          </Text>
        </>
      )}
      {target.tipo === "configurar" && details && (
        <Text tone="secondary">
          Cadastre seu salário e o dinheiro que você tem disponível agora.
          Depois, adicione contas e cartões.
        </Text>
      )}
      {target.tipo === "movimento" && (
        <>
          <Choices
            items={[
              { label: "Gasto pago", value: "saida" },
              { label: "Entrada extra", value: "entrada" },
            ]}
            value={movimento}
            onChange={(v) => setMovimento(v as "entrada" | "saida")}
          />
          {details && (
            <Text variant="bodyS" tone="secondary">
              Para compras no cartão, use Compra no crédito na aba Gastos. Para
              salário e contas cadastradas, marque o recebimento ou pagamento na
              agenda.
            </Text>
          )}
        </>
      )}
      {target.tipo === "conta" && (
        <>
          <Choices
            items={[
              { label: "Todo mês", value: "fixa" },
              { label: "Só neste mês", value: "variavel" },
              { label: "Parcelada", value: "parcelada" },
            ]}
            value={tipoConta}
            onChange={(v) => setTipoConta(v as Conta["tipo"])}
          />
          {details && (
            <Text variant="bodyS" tone="secondary">
              Cadastre aqui aluguel, serviços e dívidas pagas fora do cartão.
              Compras no crédito entram em Gastos.
            </Text>
          )}
        </>
      )}
      {!["configurar", "reserva", "saldo"].includes(target.tipo) && (
        <Field
          label={target.tipo === "movimento" ? "Descrição" : "Nome"}
          value={nome}
          onChange={setNome}
          placeholder={
            target.tipo === "conta"
              ? "Aluguel, energia, financiamento…"
              : target.tipo === "cartao"
                ? "Nome do cartão"
                : target.tipo === "compra"
                  ? "Compra ou fatura já existente"
                  : "Salário, renda extra…"
          }
        />
      )}
      {target.tipo === "compra" && (
        <Stack gap="sm">
          <Text variant="bodyBoldM">Cartão</Text>
          <Choices
            items={pila.estado.cartoes.map((c) => ({
              label: c.nome,
              value: c.id,
            }))}
            value={cartaoId}
            onChange={(id) => {
              setCartaoId(id);
              const next = pila.estado.cartoes.find((c) => c.id === id);
              if (next && dataOk(data)) setFatura(primeiraFatura(next, data));
            }}
          />
        </Stack>
      )}
      <Field
        numeric
        label={
          target.tipo === "configurar"
            ? "Salário líquido (R$)"
            : target.tipo === "cartao"
              ? "Limite total (R$)"
              : target.tipo === "conta" && tipoConta === "parcelada"
                ? "Valor de cada parcela (R$)"
                : target.tipo === "compra"
                  ? modoCompra === "fatura"
                    ? "Valor da fatura existente (R$)"
                    : "Valor total da compra (R$)"
                  : target.tipo === "reserva"
                    ? "Quanto pretende guardar por mês (R$)"
                    : target.tipo === "saldo"
                      ? "Saldo real disponível hoje (R$)"
                      : "Valor (R$)"
        }
        value={valor}
        onChange={setValor}
        placeholder="0,00"
        help={
          target.tipo === "reserva"
            ? "Esse valor entra na previsão do fim de cada mês. Use zero para desativar."
            : target.tipo === "saldo"
              ? "Informe o saldo atual da conta. Os registros anteriores continuam no histórico, sem serem somados novamente."
              : undefined
        }
      />
      {["configurar", "receita", "conta"].includes(target.tipo) && (
        <Field
          numeric
          label={
            target.tipo === "conta" ? "Dia do vencimento" : "Dia de recebimento"
          }
          value={dia}
          onChange={setDia}
          placeholder="5"
          help="Dias 29, 30 ou 31 são ajustados para o último dia nos meses mais curtos."
        />
      )}
      {target.tipo === "configurar" && (
        <>
          <Field
            numeric
            label="Saldo disponível hoje (R$)"
            value={saldo}
            onChange={setSaldo}
            help="Informe o dinheiro disponível na conta, inclusive o salário se já tiver recebido."
          />
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: recebido }}
            onPress={() => setRecebido(!recebido)}
          >
            <Text variant="bodyBoldM">
              {recebido ? "☑" : "☐"} Já recebi o salário deste mês
            </Text>
          </Pressable>
          <Text variant="bodyS" tone="secondary">
            Se marcar, o salário fica registrado como recebido e incluído no
            saldo informado.
          </Text>
        </>
      )}
      {details && ["receita", "conta", "cartao"].includes(target.tipo) && (
        <Field
          label={
            target.tipo === "conta"
              ? target.item?.tipo === "fixa"
                ? "Alterações a partir de qual mês?"
                : "Primeiro mês do cadastro"
              : "A partir de qual mês?"
          }
          value={inicio}
          onChange={setInicio}
          placeholder={mesAtual()}
          help="Formato ano-mês, por exemplo 2026-10."
        />
      )}
      {target.tipo === "cartao" && (
        <>
          <Field
            numeric
            label="Dia do fechamento"
            value={fechamento}
            onChange={setFechamento}
          />
          <Field
            numeric
            label="Dia do vencimento"
            value={vencimento}
            onChange={setVencimento}
          />
        </>
      )}
      {((target.tipo === "conta" && tipoConta === "parcelada") ||
        (target.tipo === "compra" && modoCompra !== "fatura")) && (
        <Field
          numeric
          label={
            target.tipo === "compra"
              ? "Número de parcelas"
              : "Quantas parcelas ainda faltam?"
          }
          value={parcelas}
          onChange={setParcelas}
          help={
            target.tipo === "conta"
              ? "Cadastre somente as parcelas que ainda vai pagar."
              : "Para um valor de fatura já existente, use uma parcela e escolha o mês abaixo."
          }
        />
      )}
      {target.tipo === "compra" && details && (
        <>
          {modoCompra !== "fatura" && (
            <Field
              label="Data da compra"
              value={data}
              onChange={(v) => {
                setData(v);
                if (cartao && dataOk(v)) setFatura(primeiraFatura(cartao, v));
              }}
              placeholder={diaLocal()}
              help="Formato ano-mês-dia."
            />
          )}
          <Field
            label={
              modoCompra === "fatura"
                ? "Mês da fatura (ano-mês)"
                : "Primeira fatura (ano-mês)"
            }
            value={fatura}
            onChange={setFatura}
            help={
              mesOk(fatura)
                ? `Começa em ${nomeMes(fatura, false, language)}. Confira com o seu banco; é possível ajustar este mês manualmente.`
                : "Exemplo: 2026-10."
            }
          />
        </>
      )}
      {["receita", "conta", "cartao", "compra"].includes(target.tipo) && (
        <Button
          label={details ? "Menos detalhes" : "Datas e outras opções"}
          size="md"
          variant="ghost"
          onPress={() => setDetails(!details)}
        />
      )}
      {["compra", "movimento"].includes(target.tipo) && (
        <Stack gap="sm">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: categoriesOpen }}
            onPress={() => setCategoriesOpen(!categoriesOpen)}
            style={{ paddingVertical: 12 }}
          >
            <Text variant="bodyBoldM">
              Categoria: <Text variant="bodyBoldM">{categoria}</Text>
            </Text>
          </Pressable>
          {categoriesOpen && (
            <Choices
              items={[
                "Sem categoria",
                "Alimentação",
                "Casa",
                "Transporte",
                "Saúde",
                "Lazer",
                "Compras",
                "Educação",
              ].map((label) => ({ label, value: label }))}
              value={categoria}
              onChange={(v) => {
                setCategoria(v);
                setCategoriesOpen(false);
              }}
            />
          )}
        </Stack>
      )}
      {erro ? (
        <Text accessibilityRole="alert" tone="danger">
          {erro}
        </Text>
      ) : null}
      <Button
        label={
          target.tipo === "configurar" ? "Começar meu planejamento" : "Salvar"
        }
        onPress={salvar}
      />
      {item &&
        ["receita", "conta", "cartao", "compra"].includes(target.tipo) && (
          <Stack gap="md">
            {excluir ? (
              <>
                <Text tone="danger">
                  Excluir este cadastro? Os pagamentos já registrados ficam no
                  histórico.
                </Text>
                <Button
                  variant="danger"
                  label="Confirmar exclusão"
                  onPress={() => {
                    if (
                      pila.remover(
                        target.tipo as
                          | "receita"
                          | "conta"
                          | "cartao"
                          | "compra",
                        item.id,
                      )
                    )
                      onClose();
                    else
                      setErro(
                        "Este cadastro já está vinculado a compras ou faturas pagas e precisa ser mantido para preservar os registros.",
                      );
                  }}
                />
              </>
            ) : (
              <Button
                variant="ghost"
                size="md"
                label="Excluir cadastro"
                onPress={() => setExcluir(true)}
              />
            )}
          </Stack>
        )}
    </Stack>
  );
  return embedded ? (
    content
  ) : (
    <Sheet visible title={titles[target.tipo]} onClose={onClose}>
      {content}
    </Sheet>
  );
}
