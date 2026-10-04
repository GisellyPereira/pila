import Svg, { Ellipse, Path, G, Circle } from "react-native-svg";
import { palette } from "@/src/shared/theme/tokens";
export function CofreArte({ size = 140 }: { size?: number }) {
  return <Svg accessible accessibilityLabel="Cofre do Pila" width={size} height={size} viewBox="0 0 180 180">
    <Ellipse cx="92" cy="165" rx="67" ry="8" fill={palette.noite} opacity="0.1" />
    <G stroke={palette.noite} strokeWidth="4" strokeLinejoin="round">
      <Path d="M28 49 L127 33 L156 53 V146 L58 163 L28 143 Z" fill={palette.noiteElevado} />
      <Path d="M28 49 L127 33 V132 L28 143 Z" fill={palette.creme} />
      <Path d="M42 63 L112 51 V119 L42 131 Z" fill={palette.laranja} />
      <Path d="M127 33 L156 53 V146 L127 132 Z" fill={palette.menta} />
      <Path d="M28 49 L58 68 M127 33 L156 53" fill="none" />
      <Path d="M27 70 L37 69 M27 115 L37 113" fill="none" strokeWidth="7" />
      <Circle cx="79" cy="91" r="20" fill={palette.pila} />
      <Circle cx="79" cy="91" r="5" fill={palette.noite} />
      <Path d="M79 72 V110 M61 91 H98 M66 78 L92 104 M66 104 L92 78" fill="none" strokeWidth="3" />
      <Path d="M42 145 V158 L56 159 V143 M131 143 V159 L144 156 V145" fill={palette.noite} />
      <Path d="M57 26 L89 21 L107 28 L76 34 Z" fill={palette.pila} />
      <Path d="M57 26 V35 L76 43 L107 37 V28 L76 34 Z" fill={palette.pila} />
    </G>
  </Svg>;
}
