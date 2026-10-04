# Pila — instruções do projeto

As instruções da usuária e de AGENTS.md têm prioridade.

## Proposta atual

Aplicativo de organização financeira pessoal: salário, outras receitas, contas fixas, despesas pontuais, dívidas parceladas, cartões, previsão de caixa e simulação de compras. O conceito anterior de Jota, Tribunal, Respeito e missões foi substituído. Não reintroduzir esses elementos a partir de documentos ou módulos antigos.

## Execução

A usuária executa o app. Apenas modificar arquivos e atualizar dependências quando solicitado. Não iniciar Expo, servidores, emuladores, builds ou exports. Os comandos de início devem usar um worker do Metro. Não afirmar que testes ou compilação passaram sem executá-los; nesta tarefa, a execução não está autorizada.

## Stack e estrutura

Expo SDK 57 com React Native 0.86. Ao atualizar dependências, verificar o SDK estável mais recente e alinhar React, React Native e módulos Expo.

- `mobile/app/(tabs)/`: rotas index, contas, cartoes, previsao e perfil.
- `mobile/src/features/finance/screens/`: telas atuais.
- `mobile/src/features/finance/components/`: cadastros e elementos compartilhados da experiência financeira.
- `mobile/src/domain/Planejamento.ts`: modelos, faturas, valores em centavos e projeções.
- `mobile/src/app/providers/PilaProvider.tsx`: estado, migração e persistência via AsyncStorage.
- `mobile/src/shared/theme/tokens.ts`: fonte de verdade visual; manter Tailwind sincronizado.
- `backend/`: ponte antiga para o Jota; não usada na experiência atual.

As rotas são reexports. Não colocar lógica nas rotas. Domínio é TypeScript puro. Os cadastros precisam validar valores, datas e parcelas antes de salvar.

## Regras de cálculo

Compras de cartão entram nas faturas sem descontar saldo bancário. Pagamentos de fatura afetam o saldo. Recebimentos e pagamentos só são registrados após confirmação. A opção de valor já refletido no saldo impede duplicidade ao cadastrar fatos anteriores ao saldo informado. Parcelas dividem centavos e ajustam a última parcela para preservar o valor total.

Previsões são estimativas de registros manuais. Não chamar limite de cartão de renda, não prometer dinheiro disponível e não inventar juros ou sincronização com bancos. Preservar o arquivo anterior na migração e impedir sobrescrita silenciosa quando o armazenamento não puder ser lido.

## Design e texto

Aplicar as preferências permanentes da Giselly. Linguagem clara: salário, receita, conta, despesa, parcela, fatura, saldo, reserva e previsão. Diferenciar saldo real de saldo previsto. Sem julgamentos, nomenclatura de jogo, ícones decorativos em círculos, setas diagonais, slogans para preencher espaço ou divisórias ornamentais.
