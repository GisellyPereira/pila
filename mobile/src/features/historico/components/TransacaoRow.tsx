import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import {
  CATEGORIA_LABEL,
  TAG_LABEL,
  type Transacao,
  type CategoriaTransacao,
  type TagEmocional,
} from "@/src/domain/Transacao";
import {
  Inline,
  Money,
  Pill,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import { color, radius, space } from "@/src/shared/theme/tokens";

type Props = { transacao: Transacao };

const ICON_BY_CATEGORIA: Record<CategoriaTransacao, React.ComponentProps<typeof Ionicons>["name"]> = {
  delivery: "fast-food",
  transporte: "car",
  lazer: "happy",
  mercado: "cart",
  moradia: "home",
  saude: "medkit",
  educacao: "school",
  salario: "cash",
  investimento: "trending-up",
  outros: "ellipsis-horizontal",
};

const TAG_TONE: Record<TagEmocional, "menta" | "coral" | "laranja" | "neutral" | "pila"> = {
  essencial: "menta",
  superfluo: "laranja",
  arrependido: "coral",
  merecido: "pila",
};

export function TransacaoRow({ transacao }: Props) {
  const isEntrada = transacao.tipo === "entrada";

  return (
    <View
      style={{
        flexDirection: "row",
        gap: space.md,
        paddingVertical: space.md,
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.md,
          backgroundColor: color.bg.surfaceElevated,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={ICON_BY_CATEGORIA[transacao.categoria]}
          size={20}
          color={isEntrada ? color.state.success : color.text.secondary}
        />
      </View>

      <Stack gap="xs" style={{ flex: 1 }}>
        <Inline justify="space-between" align="flex-start">
          <Stack gap="xs" style={{ flex: 1, marginRight: space.md }}>
            <Text variant="bodyBoldM" tone="primary">
              {transacao.descricao}
            </Text>
            <Text variant="bodyS" tone="muted">
              {CATEGORIA_LABEL[transacao.categoria]}
            </Text>
          </Stack>
          <Money
            value={transacao.valor}
            size="m"
            tone={isEntrada ? "positive" : "negative"}
          />
        </Inline>

        {transacao.tag || transacao.comentarioJota ? (
          <Stack gap="xs">
            {transacao.tag ? (
              <Pill label={TAG_LABEL[transacao.tag]} tone={TAG_TONE[transacao.tag]} size="sm" />
            ) : null}
            {transacao.comentarioJota ? (
              <Text variant="bubble" style={{ color: color.text.secondary }}>
                “{transacao.comentarioJota}”
              </Text>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </View>
  );
}
