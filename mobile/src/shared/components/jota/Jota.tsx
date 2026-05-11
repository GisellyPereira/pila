import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Text as SvgText,
} from "react-native-svg";

import { palette, font } from "@/src/shared/theme/tokens";

export type JotaExpression =
  | "neutro"
  | "joinha"
  | "sobrancelha"
  | "queixo-caido"
  | "desmaio"
  | "orgulho"
  | "processando";

type Props = {
  expression?: JotaExpression;
  size?: number;
  idle?: boolean;
};

export function Jota({ expression = "neutro", size = 200, idle = true }: Props) {
  const breath = useSharedValue(1);

  useEffect(() => {
    if (!idle) {
      breath.value = 1;
      return;
    }
    breath.value = withRepeat(
      withTiming(1.025, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [breath, idle]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breath.value }],
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
      <View style={{ width: size, height: size }}>
        <Svg viewBox="0 0 200 200" width={size} height={size}>
          <Circle cx={100} cy={108} r={92} fill="rgba(255,159,28,0.45)" />
          <Circle
            cx={100}
            cy={100}
            r={92}
            fill={palette.pila}
            stroke={palette.noite}
            strokeWidth={6}
          />
          <Circle
            cx={100}
            cy={100}
            r={78}
            fill="none"
            stroke={palette.noite}
            strokeWidth={3}
          />

          {expression === "neutro" && (
            <>
              <Circle cx={78} cy={92} r={6} fill={palette.noite} />
              <Circle cx={122} cy={92} r={6} fill={palette.noite} />
              <Path
                d="M 78 120 Q 100 132 122 120"
                stroke={palette.noite}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {expression === "joinha" && (
            <>
              <Path
                d="M 68 90 Q 78 84 88 90"
                stroke={palette.noite}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M 112 90 Q 122 84 132 90"
                stroke={palette.noite}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M 74 118 Q 100 140 126 118"
                stroke={palette.noite}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {expression === "sobrancelha" && (
            <>
              <Line
                x1={68}
                y1={78}
                x2={90}
                y2={82}
                stroke={palette.noite}
                strokeWidth={4}
                strokeLinecap="round"
              />
              <Line
                x1={110}
                y1={82}
                x2={132}
                y2={78}
                stroke={palette.noite}
                strokeWidth={4}
                strokeLinecap="round"
              />
              <Circle cx={78} cy={94} r={6} fill={palette.noite} />
              <Circle cx={122} cy={94} r={6} fill={palette.noite} />
              <Path
                d="M 82 122 L 118 122"
                stroke={palette.noite}
                strokeWidth={5}
                strokeLinecap="round"
              />
            </>
          )}

          {expression === "queixo-caido" && (
            <>
              <Circle
                cx={78}
                cy={88}
                r={10}
                fill="#fff"
                stroke={palette.noite}
                strokeWidth={3}
              />
              <Circle cx={78} cy={88} r={4} fill={palette.noite} />
              <Circle
                cx={122}
                cy={88}
                r={10}
                fill="#fff"
                stroke={palette.noite}
                strokeWidth={3}
              />
              <Circle cx={122} cy={88} r={4} fill={palette.noite} />
              <Ellipse cx={100} cy={132} rx={12} ry={20} fill={palette.noite} />
            </>
          )}

          {expression === "desmaio" && (
            <>
              <Path
                d="M 68 88 L 88 102 M 88 88 L 68 102"
                stroke={palette.noite}
                strokeWidth={4}
                strokeLinecap="round"
              />
              <Path
                d="M 112 88 L 132 102 M 132 88 L 112 102"
                stroke={palette.noite}
                strokeWidth={4}
                strokeLinecap="round"
              />
              <Line
                x1={80}
                y1={126}
                x2={120}
                y2={126}
                stroke={palette.noite}
                strokeWidth={5}
                strokeLinecap="round"
              />
            </>
          )}

          {expression === "orgulho" && (
            <>
              <Path
                d="M 70 92 Q 78 86 86 92"
                stroke={palette.noite}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M 114 92 Q 122 86 130 92"
                stroke={palette.noite}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M 76 120 Q 100 144 124 120"
                stroke={palette.noite}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
              <Circle cx={78} cy={138} r={3} fill={palette.menta} />
              <Circle cx={122} cy={138} r={3} fill={palette.menta} />
            </>
          )}

          {expression === "processando" && (
            <>
              <Line
                x1={70}
                y1={92}
                x2={86}
                y2={92}
                stroke={palette.noite}
                strokeWidth={5}
                strokeLinecap="round"
              />
              <Line
                x1={114}
                y1={92}
                x2={130}
                y2={92}
                stroke={palette.noite}
                strokeWidth={5}
                strokeLinecap="round"
              />
              <Circle cx={88} cy={124} r={3} fill={palette.noite} />
              <Circle cx={100} cy={124} r={3} fill={palette.noite} />
              <Circle cx={112} cy={124} r={3} fill={palette.noite} />
            </>
          )}

          <SvgText
            x={100}
            y={176}
            textAnchor="middle"
            fontFamily={font.display}
            fontSize={20}
            fill={palette.noite}
          >
            J
          </SvgText>
        </Svg>
      </View>
    </Animated.View>
  );
}
