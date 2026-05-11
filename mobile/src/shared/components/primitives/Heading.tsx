import type { TextStyle } from "react-native";

import { Text } from "./Text";

type Props = {
  level?: "xl" | "l" | "m" | "s";
  tone?: "primary" | "accent" | "secondary" | "inverse";
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
};

const VARIANT_MAP = {
  xl: "displayXL",
  l: "displayL",
  m: "displayM",
  s: "displayS",
} as const;

export function Heading({ level = "l", tone = "primary", children, style }: Props) {
  return (
    <Text variant={VARIANT_MAP[level]} tone={tone} style={style}>
      {children}
    </Text>
  );
}
