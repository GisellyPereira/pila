import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import { usePila } from "@/src/app/providers/PilaProvider";
import { somarMes } from "@/src/domain/Planejamento";
import {
  Text,
  Inline,
  Stack,
  Heading,
  Money,
} from "@/src/shared/components/primitives";
import { font, radius, space } from "@/src/shared/theme/tokens";

export function nomeMes(mes: string, curto = false, locale = "pt-BR"): string {
  return new Date(`${mes}-01T12:00:00`).toLocaleDateString(locale, {
    month: curto ? "short" : "long",
    year: "numeric",
  });
}
export function dataCurta(data: string, locale = "pt-BR"): string {
  return new Date(`${data}T12:00:00`).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
  });
}
export function MonthPicker() {
  const { color, language, t } = usePreferences();

  const { mes, setMes } = usePila();
  return (
    <Inline justify="space-between" style={{ paddingVertical: space.md }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("Mês anterior")}
        onPress={() => setMes(somarMes(mes, -1))}
        hitSlop={8}
        style={{
          padding: 12,
          borderRadius: 14,
          backgroundColor: color.bg.surfaceElevated,
        }}
      >
        <Ionicons name="chevron-back" size={20} color={color.text.primary} />
      </Pressable>
      <Text variant="bodyBoldM" style={{ textTransform: "capitalize" }}>
        {nomeMes(mes, false, language)}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("Próximo mês")}
        onPress={() => setMes(somarMes(mes, 1))}
        hitSlop={8}
        style={{
          padding: 12,
          borderRadius: 14,
          backgroundColor: color.bg.surfaceElevated,
        }}
      >
        <Ionicons name="chevron-forward" size={20} color={color.text.primary} />
      </Pressable>
    </Inline>
  );
}
export function Field({
  label,
  value,
  onChange,
  placeholder,
  numeric = false,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  numeric?: boolean;
  help?: string;
}) {
  const { color, t, scale } = usePreferences();
  const [showHelp, setShowHelp] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <Stack gap="sm">
      <Inline justify="space-between">
        <Text variant="bodyBoldM" style={{ flex: 1 }}>
          {label}
        </Text>
        {help && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t("Ajuda")}: ${t(label)}`}
            accessibilityState={{ expanded: showHelp }}
            onPress={() => setShowHelp(!showHelp)}
            style={{ padding: 8 }}
          >
            <Ionicons name="help-outline" size={20} color={color.text.accent} />
          </Pressable>
        )}
      </Inline>
      <TextInput
        accessibilityLabel={t(label)}
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder ? t(placeholder) : undefined}
        placeholderTextColor={color.text.muted}
        keyboardType={numeric ? "decimal-pad" : "default"}
        maxLength={numeric ? 16 : 80}
        style={{
          backgroundColor: color.bg.surface,
          color: color.text.primary,
          fontFamily: font.body,
          fontSize: 16 * scale,
          padding: space.lg,
          borderRadius: radius.md,
          borderWidth: 1.5,
          borderColor: focused ? color.text.accent : "transparent",
        }}
      />
      {help && showHelp ? (
        <Text variant="bodyS" tone="secondary">
          {help}
        </Text>
      ) : null}
    </Stack>
  );
}
export function Choices({
  items,
  value,
  onChange,
}: {
  items: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const { color } = usePreferences();

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
      {items.map((item) => (
        <Pressable
          key={item.value}
          accessibilityRole="button"
          accessibilityState={{ selected: item.value === value }}
          onPress={() => onChange(item.value)}
          style={{
            paddingVertical: space.md,
            paddingHorizontal: space.lg,
            backgroundColor:
              item.value === value ? color.brand.pila : color.bg.surface,
            borderRadius: radius.sm,
          }}
        >
          <Text variant="bodyS">{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
export function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Stack gap="md" style={{ paddingVertical: space.xl }}>
      <Heading level="m">{title}</Heading>
      <Text tone="secondary">{description}</Text>
    </Stack>
  );
}
export function ValueRow({
  label,
  value,
  danger = false,
  translateLabel = true,
}: {
  label: string;
  value: number;
  danger?: boolean;
  translateLabel?: boolean;
}) {
  return (
    <Inline justify="space-between" align="baseline">
      <Text
        translatable={translateLabel}
        variant="bodyS"
        tone="secondary"
        style={{ flex: 1 }}
      >
        {label}
      </Text>
      <Money value={value} size="m" tone={danger ? "negative" : "neutral"} />
    </Inline>
  );
}
