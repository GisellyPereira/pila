import type { TextStyle } from "react-native";

import { formatBRL } from "@/src/shared/utils/formatBRL";

import { Text } from "./Text";

type Props = {
  value: number;
  size?: "xl" | "l" | "m";
  tone?: "neutral" | "positive" | "negative" | "accent";
  compact?: boolean;
  style?: TextStyle | TextStyle[];
};

const SIZE_VARIANT = {
  xl: "moneyXL",
  l: "moneyL",
  m: "moneyM",
} as const;

const TONE_MAP = {
  neutral: "primary",
  positive: "success",
  negative: "danger",
  accent: "accent",
} as const;

export function Money({
  value,
  size = "l",
  tone = "neutral",
  compact = false,
  style,
}: Props) {
  const prefix = tone === "negative" && value > 0 ? "−" : "";
  return (
    <Text variant={SIZE_VARIANT[size]} tone={TONE_MAP[tone]} style={style}>
      {prefix}
      {formatBRL(Math.abs(value), compact)}
    </Text>
  );
}
