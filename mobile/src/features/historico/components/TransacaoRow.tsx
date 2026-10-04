import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { CATEGORIA_LABEL, TAG_LABEL, type Transacao, type CategoriaTransacao } from "@/src/domain/Transacao";
import { Inline, Stack, Text } from "@/src/shared/components/primitives";
import { formatBRL } from "@/src/shared/utils/formatBRL";
import { color, space } from "@/src/shared/theme/tokens";
const icons: Record<CategoriaTransacao, React.ComponentProps<typeof Ionicons>["name"]> = { delivery: "fast-food-outline", transporte: "car-outline", lazer: "ticket-outline", mercado: "basket-outline", moradia: "home-outline", saude: "medical-outline", educacao: "book-outline", salario: "briefcase-outline", investimento: "wallet-outline", outros: "bag-outline" };
export function TransacaoRow({ transacao: t }: { transacao: Transacao }) {
  const entrada = t.tipo === "entrada";
  return <View style={{ flexDirection: "row", gap: space.md, paddingVertical: space.lg }}>
    <Ionicons name={icons[t.categoria]} size={23} color={color.text.secondary} style={{ marginTop: space.xs }} />
    <Stack gap="xs" style={{ flex: 1 }}>
      <Inline justify="space-between" align="flex-start" gap="sm"><Text variant="bodyBoldM" style={{ flex: 1 }}>{t.descricao}</Text><Text variant="bodyBoldM" style={{ color: entrada ? color.state.success : color.text.primary }}>{entrada ? "+" : "−"}{formatBRL(t.valor)}</Text></Inline>
      <Text variant="bodyS" tone="muted">{CATEGORIA_LABEL[t.categoria]}{t.tag ? ` · ${TAG_LABEL[t.tag]}` : ""}</Text>
      {t.comentarioJota && <Text variant="bodyS" tone="secondary" style={{ marginTop: space.xs }}>Jota: {t.comentarioJota}</Text>}
    </Stack>
  </View>;
}
