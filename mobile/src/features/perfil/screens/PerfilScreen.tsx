import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { CONQUISTAS_MOCK } from "@/src/data/mocks/conquistas.mock";
import { RESUMO_MES_MOCK } from "@/src/data/mocks/metas.mock";
import { NivelCard } from "@/src/features/perfil/components/NivelCard";
import { TrofeuGrid } from "@/src/features/perfil/components/TrofeuGrid";
import {
  Card,
  Divider,
  Heading,
  Inline,
  Screen,
  Stack,
  Text,
} from "@/src/shared/components/primitives";
import { nivelPorRespeito } from "@/src/domain/Nivel";
import { color, space } from "@/src/shared/theme/tokens";

const CONFIG_ITEMS: { icone: React.ComponentProps<typeof Ionicons>["name"]; titulo: string; descricao: string }[] = [
  { icone: "notifications", titulo: "Notificações", descricao: "Como o Jota te incomoda" },
  { icone: "color-palette", titulo: "Aparência do Jota", descricao: "Em breve: vozes regionais" },
  { icone: "trash", titulo: "Limpar dados", descricao: "Começar do zero" },
  { icone: "information-circle", titulo: "Sobre o PILA", descricao: "Manifesto e créditos" },
];

export default function PerfilScreen() {
  const nivel = nivelPorRespeito(RESUMO_MES_MOCK.respeito);
  const desbloqueadas = CONQUISTAS_MOCK.filter((c) => c.desbloqueada).length;

  return (
    <Screen scroll>
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading level="xl">Você</Heading>
          <Text variant="bodyM" tone="secondary">
            O que o Jota acha de você até agora.
          </Text>
        </Stack>

        <NivelCard nivel={nivel} respeito={RESUMO_MES_MOCK.respeito} />

        <Stack gap="md">
          <Inline justify="space-between" align="baseline">
            <Heading level="m">Troféus</Heading>
            <Text variant="labelCaps" tone="muted">
              {desbloqueadas} / {CONQUISTAS_MOCK.length}
            </Text>
          </Inline>
          <TrofeuGrid conquistas={CONQUISTAS_MOCK} />
        </Stack>

        <Card tone="highlight" padding="lg">
          <Stack gap="sm">
            <Text variant="labelCaps" tone="inverse">
              Loja do Jota — em breve
            </Text>
            <Text variant="bodyL" tone="inverse">
              Vozes regionais (Carioca, Nordestino, Gaúcho, Paulistano), pacotes de frases, e
              roupas pro Jota. Troque por Respeito.
            </Text>
          </Stack>
        </Card>

        <Stack gap="md">
          <Heading level="m">Configurações</Heading>
          <Card tone="surface" padding="none">
            {CONFIG_ITEMS.map((item, idx) => (
              <View key={item.titulo}>
                <View style={{ padding: space.lg }}>
                  <Inline gap="md" align="center">
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: color.bg.surfaceElevated,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name={item.icone} size={18} color={color.brand.pila} />
                    </View>
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Text variant="bodyBoldM">{item.titulo}</Text>
                      <Text variant="bodyS" tone="muted">
                        {item.descricao}
                      </Text>
                    </Stack>
                    <Ionicons name="chevron-forward" size={18} color={color.text.muted} />
                  </Inline>
                </View>
                {idx < CONFIG_ITEMS.length - 1 ? <Divider marginY="xs" /> : null}
              </View>
            ))}
          </Card>
        </Stack>
      </Stack>
    </Screen>
  );
}
