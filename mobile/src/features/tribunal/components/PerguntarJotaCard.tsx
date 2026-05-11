import { useState } from "react";
import { TextInput, View } from "react-native";

import { perguntarJota } from "@/src/data/jota/jotaClient";
import { Button, Card, Stack, Text } from "@/src/shared/components/primitives";
import { color, font, radius, space } from "@/src/shared/theme/tokens";

type Props = {
  onResposta: (resposta: string) => void;
  onPensando: () => void;
  onErro: () => void;
};

export function PerguntarJotaCard({ onResposta, onPensando, onErro }: Props) {
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    const texto = input.trim();
    if (!texto || carregando) return;

    setCarregando(true);
    onPensando();
    setInput("");

    try {
      const resposta = await perguntarJota(texto);
      onResposta(resposta);
    } catch (e) {
      console.error(e);
      onErro();
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Card tone="outline" padding="lg">
      <Stack gap="md">
        <Text variant="labelCaps" tone="accent">
          Fala com o Jota
        </Text>
        <View>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Conta o que aprontou..."
            placeholderTextColor={color.text.muted}
            editable={!carregando}
            multiline
            style={{
              minHeight: 56,
              backgroundColor: color.bg.surfaceElevated,
              borderRadius: radius.lg,
              paddingHorizontal: space.lg,
              paddingVertical: space.md,
              fontFamily: font.body,
              fontSize: 15,
              color: color.text.primary,
              textAlignVertical: "top",
            }}
          />
        </View>
        <Button
          label="Mandar pro Jota"
          variant="primary"
          size="md"
          loading={carregando}
          disabled={!input.trim()}
          onPress={enviar}
        />
      </Stack>
    </Card>
  );
}
