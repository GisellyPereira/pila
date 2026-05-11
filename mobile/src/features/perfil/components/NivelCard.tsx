import { View } from "react-native";

import { type Nivel, NIVEIS, proximoNivel } from "@/src/domain/Nivel";
import { Jota } from "@/src/shared/components/jota/Jota";
import {
  Card,
  Heading,
  Inline,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import { color, radius, space } from "@/src/shared/theme/tokens";

type Props = {
  nivel: Nivel;
  respeito: number;
};

export function NivelCard({ nivel, respeito }: Props) {
  const proximo = proximoNivel(respeito);
  const ultimoTier = NIVEIS[NIVEIS.length - 1];
  const proximoMin = proximo?.respeitoMinimo ?? ultimoTier.respeitoMinimo;
  const faixa = proximoMin - nivel.respeitoMinimo;
  const ganho = respeito - nivel.respeitoMinimo;
  const percent = faixa > 0 ? Math.min(1, ganho / faixa) : 1;

  return (
    <Card tone="surface" padding="lg">
      <Inline gap="md" align="center" justify="space-between">
        <View>
          <Jota expression="orgulho" size={96} />
        </View>
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text variant="labelCaps" tone="accent">
            Nível {nivel.id} de {NIVEIS.length}
          </Text>
          <Heading level="m">{nivel.nome}</Heading>
          <Text variant="bodyS" tone="secondary">
            {nivel.descricao}
          </Text>
        </Stack>
      </Inline>

      <View style={{ height: space.lg }} />

      <Stack gap="xs">
        <Inline justify="space-between" align="baseline">
          <Text variant="labelCaps" tone="muted">
            Respeito
          </Text>
          <Text variant="bodyBoldM" tone="primary">
            {respeito}
            {proximo ? ` / ${proximo.respeitoMinimo}` : ""}
          </Text>
        </Inline>
        <View
          style={{
            height: 8,
            backgroundColor: color.bg.surfaceElevated,
            borderRadius: radius.pill,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${percent * 100}%`,
              backgroundColor: color.brand.pila,
            }}
          />
        </View>
        {proximo ? (
          <Text variant="bodyS" tone="muted">
            Faltam {proximo.respeitoMinimo - respeito} pra {proximo.nome}.
          </Text>
        ) : (
          <Text variant="bodyS" tone="success">
            Você já é lenda. Não tem nível acima.
          </Text>
        )}
      </Stack>
    </Card>
  );
}
