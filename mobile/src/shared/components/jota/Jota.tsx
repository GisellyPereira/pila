import { useEffect } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, useReducedMotion } from "react-native-reanimated";
import Svg, { Path, Ellipse, Circle, G } from "react-native-svg";
import { palette } from "@/src/shared/theme/tokens";

export type JotaExpression = "neutro" | "joinha" | "sobrancelha" | "queixo-caido" | "desmaio" | "orgulho" | "processando";
type Props = { expression?: JotaExpression; size?: number; idle?: boolean };
export function Jota({ expression = "neutro", size = 200, idle = true }: Props) {
  const breath = useSharedValue(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    breath.value = idle && !reduced ? withRepeat(withTiming(-4, { duration: 1800, easing: Easing.inOut(Easing.quad) }), -1, true) : 0;
  }, [breath, idle, reduced]);
  const motion = useAnimatedStyle(() => ({ transform: [{ translateY: breath.value }] }));
  const happy = expression === "orgulho" || expression === "joinha";
  const shocked = expression === "queixo-caido" || expression === "desmaio";
  return <Animated.View accessible accessibilityLabel={`Jota ${expression}`} style={[{ width: size, height: size }, motion]}>
    <Svg width={size} height={size} viewBox="0 0 260 260">
      <Ellipse cx="138" cy="244" rx="72" ry="9" fill={palette.noite} opacity="0.08" />
      <G stroke={palette.noite} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M91 196 L82 232 L63 233 Q51 240 66 244 L96 244 L103 213" fill={palette.noite} />
        <Path d="M160 198 L178 232 L194 231 Q209 232 206 240 L171 244 L147 212" fill={palette.noite} />
        <Path d={happy ? "M53 137 Q17 128 26 91 M195 135 Q228 125 229 85" : "M52 135 Q21 153 29 178 M199 131 Q235 146 226 177"} fill="none" />
        <Path d={happy ? "M20 94 Q9 77 20 72 L29 80 Q28 60 40 65 L41 89 L34 99 Z" : "M25 171 Q13 160 10 172 L16 194 Q29 205 39 190 L38 178 Z"} fill={palette.creme} />
        <Path d={happy ? "M223 87 L216 70 Q217 60 224 68 L231 72 L234 57 Q241 51 245 63 L245 86 L234 96 Z" : "M219 169 Q233 156 239 170 L235 193 Q222 205 214 188 Z"} fill={palette.creme} />
        <Path d="M69 52 Q135 3 198 61 Q246 143 187 197 Q125 238 71 181 Q28 107 69 52 Z" fill={palette.laranja} />
        <Path d="M56 54 Q121 9 181 61 Q225 139 172 189 Q114 229 57 175 Q15 107 56 54 Z" fill={palette.pila} />
        <Path d="M63 64 Q118 24 168 70 Q205 135 162 178 Q113 211 67 169 Q32 109 63 64 Z" fill="none" strokeWidth="3" />
      </G>
      <Path d="M55 78 Q69 47 101 43" stroke={palette.creme} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.8" />
      <G stroke={palette.noite} strokeWidth="6" strokeLinecap="round" fill="none">
        <Path d={expression === "sobrancelha" ? "M73 79 L95 69 M127 76 L150 82" : "M72 78 Q84 70 98 77 M125 76 Q139 69 151 78"} />
        {expression === "desmaio" ? <><Path d="M74 94 L94 114 M94 94 L74 114 M127 94 L147 114 M147 94 L127 114" /></> : happy ? <><Path d="M73 104 Q84 91 97 104 M125 104 Q138 91 150 104" /></> : <><Ellipse cx="84" cy="102" rx="9" ry="14" fill={palette.noite} strokeWidth="0" /><Ellipse cx="136" cy="102" rx="9" ry="14" fill={palette.noite} strokeWidth="0" /><Circle cx="87" cy="98" r="3" fill={palette.creme} strokeWidth="0" /><Circle cx="139" cy="98" r="3" fill={palette.creme} strokeWidth="0" /></>}
        {shocked ? <Ellipse cx="112" cy="149" rx="16" ry="22" fill={palette.noite} /> : happy ? <Path d="M80 133 Q114 175 145 130 Q112 142 80 133 Z" fill={palette.noite} /> : <Path d={expression === "processando" ? "M104 147 L126 145" : "M87 141 Q116 160 141 133"} />}
      </G>
      {happy && <Path d="M95 143 Q112 158 130 141" stroke={palette.creme} strokeWidth="5" fill="none" />}
      <Ellipse cx="63" cy="127" rx="12" ry="6" fill={palette.coral} opacity="0.55" transform="rotate(15 63 127)" />
      <Ellipse cx="161" cy="123" rx="11" ry="6" fill={palette.coral} opacity="0.55" transform="rotate(-15 161 123)" />
    </Svg>
  </Animated.View>;
}
