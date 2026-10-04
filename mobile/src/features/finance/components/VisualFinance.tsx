import { Pressable, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { Text, Stack, Inline, Money } from "@/src/shared/components/primitives";

export function BudgetRing({
  income,
  committed,
}: {
  income: number;
  committed: number;
}) {
  const { color, t } = usePreferences();
  const percent = income > 0 ? Math.round((committed / income) * 100) : 0;
  const length = 2 * Math.PI * 45;
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={
        income > 0
          ? `${percent}% ${t("da renda comprometida")}`
          : t("Sem renda cadastrada")
      }
      style={{
        width: 114,
        height: 114,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={114}
        height={114}
        style={{ position: "absolute" }}
        viewBox="0 0 114 114"
      >
        <Circle
          cx={57}
          cy={57}
          r={45}
          stroke={color.bg.surfaceElevated}
          strokeWidth={10}
          fill="none"
        />
        <Circle
          cx={57}
          cy={57}
          r={45}
          stroke={percent > 100 ? color.state.danger : color.chart.purple}
          strokeWidth={10}
          fill="none"
          strokeDasharray={`${length * Math.min(1, Math.max(0, percent / 100))} ${length}`}
          strokeLinecap="round"
          rotation={-90}
          origin="57,57"
        />
      </Svg>
      <Text variant="displayM">{income > 0 ? `${percent}%` : "—"}</Text>
      <Text variant="bodyS" tone="secondary">
        da renda
      </Text>
    </View>
  );
}
export function QuickAction({
  label,
  icon,
  onPress,
  primary = false,
  tone = "blue",
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  primary?: boolean;
  tone?: "blue" | "rose" | "slate";
}) {
  const { color, t } = usePreferences();
  const background = primary
    ? color.feature[`${tone}Strong`]
    : color.feature[`${tone}Surface`];
  const ink = primary
    ? color.feature[`${tone}Text`]
    : color.feature[`${tone}Ink`];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(label)}
      onPress={onPress}
      style={{
        flex: 1,
        minHeight: 92,
        padding: 14,
        borderRadius: 22,
        backgroundColor: background,
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <Ionicons name={icon} size={25} color={ink} />
      <Text variant="bodyBoldM" style={{ color: ink }}>
        {label}
      </Text>
    </Pressable>
  );
}
export const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Alimentação: "restaurant-outline",
  Casa: "home-outline",
  Transporte: "bus-outline",
  Saúde: "medkit-outline",
  Lazer: "game-controller-outline",
  Compras: "bag-handle-outline",
  Educação: "book-outline",
};
export function CategoryOverview({
  groups,
  total,
  selected,
  onSelect,
}: {
  groups: [string, number][];
  total: number;
  selected: string;
  onSelect: (category: string) => void;
}) {
  const { color, t } = usePreferences();
  const paints = [
    color.chart.blue,
    color.chart.pink,
    color.chart.slate,
    color.chart.purple,
  ];
  const surfaces = [
    color.feature.blueSurface,
    color.feature.roseSurface,
    color.feature.slateSurface,
    color.bg.surface,
  ];
  const inks = [
    color.feature.blueInk,
    color.feature.roseInk,
    color.feature.slateInk,
    color.text.primary,
  ];
  return (
    <Stack gap="lg">
      <View
        accessibilityRole="image"
        accessibilityLabel={groups
          .map(
            ([name, cents]) =>
              `${t(name)}: ${total > 0 ? Math.round((cents / (total * 100)) * 100) : 0}%`,
          )
          .join(". ")}
        style={{
          flexDirection: "row",
          height: 16,
          gap: 3,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {groups.map(([name, cents], i) => (
          <View
            key={name}
            style={{ flex: cents, backgroundColor: paints[i % paints.length] }}
          />
        ))}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {groups.map(([name, cents], i) => (
          <Pressable
            key={name}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === name }}
            accessibilityLabel={`${t("Filtrar por")} ${t(name)}`}
            onPress={() => onSelect(selected === name ? "todos" : name)}
            style={{
              width: "48%",
              padding: 14,
              borderRadius: 18,
              backgroundColor: surfaces[i % surfaces.length],
              borderWidth: 1.5,
              borderColor:
                selected === name ? inks[i % inks.length] : "transparent",
              gap: 8,
            }}
          >
            <Inline justify="space-between">
              <Ionicons
                name={categoryIcons[name] ?? "pricetag-outline"}
                size={22}
                color={inks[i % inks.length]}
              />
              <Text variant="bodyS" tone="secondary">
                {total > 0 ? Math.round((cents / (total * 100)) * 100) : 0}%
              </Text>
            </Inline>
            <Text variant="bodyS">{name}</Text>
            <Money value={cents / 100} size="m" />
          </Pressable>
        ))}
      </View>
    </Stack>
  );
}
