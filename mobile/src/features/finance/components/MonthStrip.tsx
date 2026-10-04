import { Pressable, ScrollView, View } from "react-native";
import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { Text } from "@/src/shared/components/primitives";
import { dataVencimento, type Evento } from "@/src/domain/Planejamento";
export function MonthStrip({
  mes,
  events,
  selected,
  onSelect,
}: {
  mes: string;
  events: Evento[];
  selected: string | null;
  onSelect: (day: string | null) => void;
}) {
  const { color, language } = usePreferences();
  const days = Number(dataVencimento(mes, 31).slice(8));
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
    >
      {Array.from({ length: days }, (_, i) => {
        const day = `${mes}-${String(i + 1).padStart(2, "0")}`;
        const count = events.filter((e) => e.data === day).length;
        const active = selected === day;
        return (
          <Pressable
            key={day}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${new Date(`${day}T12:00:00`).toLocaleDateString(language, { day: "numeric", month: "long" })}: ${count} ${language === "en-US" ? "commitments" : "compromissos"}`}
            onPress={() => onSelect(active ? null : day)}
            style={{
              minWidth: 54,
              paddingVertical: 12,
              paddingHorizontal: 8,
              borderRadius: 18,
              alignItems: "center",
              gap: 8,
              backgroundColor: active
                ? color.feature.blueInk
                : count
                  ? color.feature.blueSurface
                  : color.bg.surface,
            }}
          >
            <Text
              variant="bodyS"
              style={{
                color: active
                  ? color.action.text
                  : count
                    ? color.feature.blueInk
                    : color.text.secondary,
              }}
            >
              {new Date(`${day}T12:00:00`)
                .toLocaleDateString(language, { weekday: "short" })
                .replace(".", "")}
            </Text>
            <Text
              variant="bodyBoldM"
              style={{
                color: active
                  ? color.action.text
                  : count
                    ? color.feature.blueInk
                    : color.text.primary,
              }}
            >
              {i + 1}
            </Text>
            <View style={{ minHeight: 18 }}>
              <Text
                variant="bodyS"
                style={{
                  color: active ? color.action.text : color.feature.blueInk,
                }}
              >
                {count ? count : " "}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
