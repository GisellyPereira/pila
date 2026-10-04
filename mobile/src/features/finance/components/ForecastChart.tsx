import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import Svg, { Circle, Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Inline, Stack, Text } from "@/src/shared/components/primitives";
import { nomeMes } from "./FinanceUI";

type Point = { mes: string; saldo: number };
export function ForecastChart({
  points,
  comparison,
  selected = 0,
  onSelect,
}: {
  points: Point[];
  comparison?: Point[];
  selected?: number;
  onSelect?: (index: number) => void;
}) {
  const { color, language } = usePreferences();

  const start = Math.floor(selected / 6) * 6;
  const visible = points.slice(start, start + 6);
  const other = comparison?.slice(start, start + 6);
  const all = [...visible, ...(other ?? [])].map((p) => p.saldo);
  const min = Math.min(0, ...all),
    max = Math.max(1, ...all),
    range = max - min;
  const x = (i: number) => 16 + i * (288 / Math.max(1, visible.length - 1));
  const y = (v: number) => 18 + (1 - (v - min) / range) * 122;
  const line = (rows: Point[]) =>
    rows.map((p, i) => `${i ? "L" : "M"}${x(i)} ${y(p.saldo)}`).join(" ");
  return (
    <Stack gap="md">
      <View
        accessibilityRole="image"
        accessibilityLabel={`${language === "en-US" ? "Projected month-end balance." : "Saldo projetado no fim de cada mês."} ${visible.map((p, i) => `${nomeMes(p.mes, false, language)}: ${p.saldo.toFixed(2)} ${language === "en-US" ? "Brazilian reais" : "reais"}${other ? `; ${language === "en-US" ? "with this purchase" : "com a compra"}: ${other[i].saldo.toFixed(2)}` : ""}`).join(". ")}`}
      >
        <Svg width="100%" height={170} viewBox="0 0 320 160">
          <Path
            d={`M16 ${y(0)} H304`}
            stroke={color.border.strong}
            strokeDasharray="3 6"
          />
          <Path
            d={`${line(visible)} L${x(visible.length - 1)} 152 L16 152 Z`}
            fill={color.accent.menta}
            opacity={0.07}
          />
          <Path
            d={line(visible)}
            stroke={color.accent.menta}
            strokeWidth={3}
            fill="none"
            strokeLinejoin="round"
          />
          {other && (
            <Path
              d={line(other)}
              stroke={color.accent.coral}
              strokeWidth={3}
              fill="none"
              strokeLinejoin="round"
            />
          )}
          {visible.map((p, i) => (
            <Circle
              key={p.mes}
              cx={x(i)}
              cy={y(p.saldo)}
              r={start + i === selected ? 7 : 4}
              onPress={() => onSelect?.(start + i)}
              fill={color.accent.menta}
            />
          ))}
        </Svg>
      </View>
      <Inline gap="xs" justify="space-between">
        {visible.map((p, i) => (
          <Pressable
            key={p.mes}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === start + i }}
            accessibilityLabel={nomeMes(p.mes, false, language)}
            disabled={!onSelect}
            onPress={() => onSelect?.(start + i)}
            style={{
              flex: 1,
              minHeight: 44,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
              backgroundColor:
                selected === start + i
                  ? color.bg.surfaceElevated
                  : "transparent",
            }}
          >
            <Text
              variant="bodyS"
              tone={selected === start + i ? "accent" : "secondary"}
            >
              {nomeMes(p.mes, true, language).split(" ")[0]}
            </Text>
          </Pressable>
        ))}
      </Inline>
      {points.length > 6 && (
        <Inline justify="space-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              language === "en-US" ? "Earlier months" : "Meses anteriores"
            }
            disabled={start === 0}
            onPress={() => onSelect?.(Math.max(0, start - 6))}
            style={{ padding: 12, opacity: start === 0 ? 0.35 : 1 }}
          >
            <Ionicons name="chevron-back" size={22} color={color.text.accent} />
          </Pressable>
          <Text variant="bodyS" tone="secondary">
            {Math.floor(selected / 6) + 1}/{Math.ceil(points.length / 6)}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              language === "en-US" ? "Next months" : "Próximos meses"
            }
            disabled={start + 6 >= points.length}
            onPress={() => onSelect?.(start + 6)}
            style={{
              padding: 12,
              opacity: start + 6 >= points.length ? 0.35 : 1,
            }}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color={color.text.accent}
            />
          </Pressable>
        </Inline>
      )}
      <Text variant="bodyS" tone="secondary">
        Linha contínua: previsão atual
        {other ? " · Segunda linha: com esta compra" : ""}. A referência
        tracejada marca saldo zero.
      </Text>
    </Stack>
  );
}
