import { useState } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Inline } from "./Stack";
import { Text } from "./Text";
import { Heading } from "./Heading";
import { Sheet } from "./Sheet";
import { space } from "@/src/shared/theme/tokens";
import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
export function PageTitle({
  title,
  description,
  aside,
}: {
  label?: string;
  title: string;
  description?: string;
  aside?: React.ReactNode;
}) {
  const { color, t } = usePreferences();
  const [help, setHelp] = useState(false);
  return (
    <Stack gap="md" style={{ paddingTop: space.sm, marginBottom: space.lg }}>
      <Inline justify="space-between">
        <Heading level="l" style={{ flex: 1 }}>
          {title.replace(/\n/g, " ")}
        </Heading>
        {aside}
        {description && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t("Sobre esta tela")}: ${t(title)}`}
            onPress={() => setHelp(true)}
            style={{
              padding: 12,
              borderRadius: 14,
              backgroundColor: color.bg.surface,
            }}
          >
            <Ionicons
              name="help-outline"
              size={22}
              color={color.text.primary}
            />
          </Pressable>
        )}
      </Inline>
      <Sheet visible={help} title={title} onClose={() => setHelp(false)}>
        <Text>{description}</Text>
      </Sheet>
    </Stack>
  );
}
