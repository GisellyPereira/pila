import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { type Missao, DIFICULDADE_LABEL } from "@/src/domain/Missao";
import {
  Card,
  Heading,
  Inline,
  Pill,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import { color, space } from "@/src/shared/theme/tokens";

type Props = {
  missao: Missao;
  expanded: boolean;
  onToggle: () => void;
};

export function MissaoItem({ missao, expanded, onToggle }: Props) {
  return (
    <Card tone="surface" padding="lg" onPress={onToggle}>
      <Stack gap="md">
        <Inline gap="md" align="flex-start">
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: missao.concluida ? color.state.success : color.border.strong,
              backgroundColor: missao.concluida ? color.state.success : "transparent",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            {missao.concluida ? (
              <Ionicons name="checkmark" size={18} color={color.text.inverse} />
            ) : null}
          </View>

          <Stack gap="xs" style={{ flex: 1 }}>
            <Heading
              level="s"
              tone={missao.concluida ? "secondary" : "primary"}
              style={{
                textDecorationLine: missao.concluida ? "line-through" : "none",
              }}
            >
              {missao.titulo}
            </Heading>
            <Text variant="bodyS" tone="secondary">
              {missao.descricao}
            </Text>
          </Stack>
        </Inline>

        <Inline gap="sm">
          <Pill label={`+${missao.recompensaRespeito} Respeito`} tone="pila" size="sm" />
          <Pill label={DIFICULDADE_LABEL[missao.dificuldade]} tone="neutral" size="sm" />
        </Inline>

        {expanded ? (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: color.border.subtle,
              paddingTop: space.md,
            }}
          >
            <Stack gap="xs">
              <Text variant="labelCaps" tone="accent">
                Por que isso importa
              </Text>
              <Text variant="bodyM" tone="primary">
                {missao.porqueImporta}
              </Text>
            </Stack>
          </View>
        ) : (
          <Text variant="bodyS" tone="muted">
            Toque pra entender por que essa missão importa.
          </Text>
        )}
      </Stack>
    </Card>
  );
}
