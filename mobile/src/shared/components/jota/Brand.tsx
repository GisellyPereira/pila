import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import Svg, { Path, Rect } from "react-native-svg";
import { palette } from "@/src/shared/theme/tokens";
/** Marca desenhada em vetor: curvas abertas e hastes com proporções próprias. */
export function Brand({ width = 104 }: { width?: number }) {
  const { color, dark } = usePreferences();
  return (
    <Svg
      accessibilityRole="image"
      accessibilityLabel="Pila"
      width={width}
      height={width * 0.42}
      viewBox="0 0 148 62"
    >
      <Path
        fill={dark ? "#B8CE4F" : palette.menta}
        fillRule="evenodd"
        d="M4 61V17h10v4Q20 15 28 15C41 15 48 24 48 35S40 54 28 54Q20 54 14 49V61Zm10-26C14 27 18 24 25 24S37 28 37 35S32 45 25 45S14 42 14 35Z"
      />
      <Rect
        x="57"
        y="18"
        width="10"
        height="36"
        rx="3"
        fill={color.text.primary}
      />
      <Path
        d="M79 4h10v36c0 5 2 7 7 7v8c-12 1-17-5-17-15V4Z"
        fill={color.text.primary}
      />
      <Path
        fill={color.text.primary}
        fillRule="evenodd"
        d="M106 21c5-4 11-6 18-6 12 0 19 6 19 16v23h-10v-4c-4 4-8 6-14 6-9 0-15-5-15-12 0-9 8-14 28-14-1-4-4-6-9-6-5 0-9 2-13 4l-4-7Zm26 17c-12-1-18 1-18 6 0 3 3 5 7 5 7 0 11-4 11-9v-2Z"
      />
      <Path d="M57 5h10v8H57z" fill={palette.coral} />
    </Svg>
  );
}
