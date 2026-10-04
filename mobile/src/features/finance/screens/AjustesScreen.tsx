import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Brand } from "@/src/shared/components/jota/Brand";
import {
  Screen,
  Stack,
  Text,
  Heading,
  Button,
} from "@/src/shared/components/primitives";
import {
  usePreferences,
  type ThemeChoice,
  type Language,
  type TextSize,
} from "@/src/shared/preferences/PreferencesProvider";
import { Choices } from "../components/FinanceUI";
export default function AjustesScreen() {
  const {
    color,
    theme,
    language,
    textSize,
    setTheme,
    setLanguage,
    setTextSize,
    error,
  } = usePreferences();
  const router = useRouter();
  return (
    <Screen scroll>
      <Stack gap="2xl">
        <Stack gap="lg" style={{ paddingVertical: 16 }}>
          <Brand width={140} />
          <Text tone="secondary">Uma organização que acompanha você.</Text>
        </Stack>
        <Stack gap="lg">
          <Heading level="m">Aparência</Heading>
          <Text tone="secondary">
            Escolha como o Pila aparece neste aparelho.
          </Text>
          <Choices
            items={[
              { label: "Claro", value: "light" },
              { label: "Escuro", value: "dark" },
              { label: "Sistema", value: "system" },
            ]}
            value={theme}
            onChange={(v) => setTheme(v as ThemeChoice)}
          />
        </Stack>
        <Stack gap="lg">
          <Heading level="m">Idioma</Heading>
          <Choices
            items={[
              { label: "Português (Brasil)", value: "pt-BR" },
              { label: "English", value: "en-US" },
            ]}
            value={language}
            onChange={(v) => setLanguage(v as Language)}
          />
          <Text variant="bodyS" tone="secondary">
            Os nomes dos seus registros são preservados. Os valores continuam em
            reais.
          </Text>
        </Stack>
        <Stack gap="lg">
          <Heading level="m">Tamanho do texto</Heading>
          <Choices
            items={[
              { label: "Padrão", value: "normal" },
              { label: "Grande", value: "large" },
              { label: "Maior", value: "extra" },
            ]}
            value={textSize}
            onChange={(v) => setTextSize(v as TextSize)}
          />
          <Stack
            gap="sm"
            style={{
              padding: 24,
              borderRadius: 24,
              backgroundColor: color.bg.surface,
            }}
          >
            <Text variant="bodyBoldM">Prévia de leitura</Text>
            <Text>Seu planejamento deve ser fácil de ler.</Text>
            <Text variant="bodyS" tone="secondary">
              O ajuste também respeita o tamanho do texto escolhido no sistema.
            </Text>
          </Stack>
        </Stack>
        <Stack gap="lg">
          <Heading level="m">Seu planejamento</Heading>
          <Button
            label="Minha renda e dados"
            variant="secondary"
            onPress={() => router.push("/perfil")}
          />
        </Stack>
        <Stack gap="md">
          <Heading level="m">Sobre o Pila</Heading>
          <Text tone="secondary">
            Construído com React Native, Expo e TypeScript.
          </Text>
          <Text variant="bodyS" tone="secondary">
            Seus registros e preferências ficam neste aparelho. Sem conexão
            bancária ou sincronização automática.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setTheme("light");
              setLanguage("pt-BR");
              setTextSize("normal");
            }}
            style={{ paddingVertical: 12 }}
          >
            <Text variant="bodyBoldM">Restaurar preferências de aparência</Text>
          </Pressable>
        </Stack>
        {error && (
          <Text tone="danger">
            Não foi possível carregar ou salvar as preferências. Seus dados
            financeiros foram preservados.
          </Text>
        )}
      </Stack>
    </Screen>
  );
}
