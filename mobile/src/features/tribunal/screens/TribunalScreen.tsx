import { useState } from "react";
import { View } from "react-native";

import { falaDoDia } from "@/src/data/falas/falas";
import { RESUMO_MES_MOCK } from "@/src/data/mocks/metas.mock";
import { DicaDoDiaCard } from "@/src/features/tribunal/components/DicaDoDiaCard";
import { PerguntarJotaCard } from "@/src/features/tribunal/components/PerguntarJotaCard";
import { SaldoCard } from "@/src/features/tribunal/components/SaldoCard";
import { JotaHero } from "@/src/shared/components/jota/JotaHero";
import type { JotaExpression } from "@/src/shared/components/jota/Jota";
import {
  Button,
  Heading,
  Inline,
  Screen,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import { nivelPorRespeito } from "@/src/domain/Nivel";
import { space } from "@/src/shared/theme/tokens";

export default function TribunalScreen() {
  const [fala, setFala] = useState<string>(falaDoDia());
  const [expressao, setExpressao] = useState<JotaExpression>("neutro");

  const nivel = nivelPorRespeito(RESUMO_MES_MOCK.respeito);

  function registrarResistencia() {
    setFala("Boa. +5 Respeito. Continua assim.");
    setExpressao("orgulho");
  }

  function registrarGasto() {
    setFala("Anotado. Depois a gente conversa sobre esse seu padrão.");
    setExpressao("sobrancelha");
  }

  return (
    <Screen scroll>
      <Inline justify="space-between" align="baseline">
        <Heading level="l" tone="accent">
          PILA
        </Heading>
        <Text variant="labelCaps" tone="muted">
          {nivel.nome}
        </Text>
      </Inline>

      <View style={{ height: space.xl }} />

      <JotaHero
        fala={fala}
        expression={expressao}
        size={220}
        onPress={() => {
          setFala(falaDoDia());
          setExpressao("neutro");
        }}
      />

      <View style={{ height: space["2xl"] }} />

      <Stack gap="lg">
        <SaldoCard
          sobrou={RESUMO_MES_MOCK.sobrou}
          entradas={RESUMO_MES_MOCK.entradas}
          saidas={RESUMO_MES_MOCK.saidas}
        />

        <Stack gap="md">
          <Button
            label="+ Registrei um gasto"
            variant="primary"
            size="lg"
            onPress={registrarGasto}
          />
          <Button
            label="Eu resisti! +5 Respeito"
            variant="secondary"
            size="md"
            onPress={registrarResistencia}
          />
        </Stack>

        <DicaDoDiaCard
          titulo="Delivery soma mais que parece"
          texto="A taxa de entrega + serviço + gorjeta costuma somar 30% do valor do prato. Cozinhar 3x na semana economiza ~R$ 200/mês em média."
        />

        <PerguntarJotaCard
          onPensando={() => {
            setFala("Calma, deixa eu pensar...");
            setExpressao("processando");
          }}
          onResposta={(resposta) => {
            setFala(resposta);
            setExpressao("queixo-caido");
          }}
          onErro={() => {
            setFala("Travei aqui. Tenta de novo daqui a pouco.");
            setExpressao("desmaio");
          }}
        />
      </Stack>
    </Screen>
  );
}
