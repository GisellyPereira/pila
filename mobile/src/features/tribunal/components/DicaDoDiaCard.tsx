import { Card, Stack, Text } from "@/src/shared/components/primitives";

type Props = {
  titulo: string;
  texto: string;
};

export function DicaDoDiaCard({ titulo, texto }: Props) {
  return (
    <Card tone="outline" padding="lg">
      <Stack gap="sm">
        <Text variant="labelCaps" tone="accent">
          💡 Dica do dia
        </Text>
        <Text variant="displayS" tone="primary">
          {titulo}
        </Text>
        <Text variant="bodyM" tone="secondary">
          {texto}
        </Text>
      </Stack>
    </Card>
  );
}
