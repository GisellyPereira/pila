import {
  ArchivoBlack_400Regular,
  useFonts as useArchivoBlack,
} from "@expo-google-fonts/archivo-black";
import {
  Caveat_400Regular,
  Caveat_700Bold,
  useFonts as useCaveat,
} from "@expo-google-fonts/caveat";
import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts as useInter,
} from "@expo-google-fonts/inter";
import { View } from "react-native";

import { color } from "@/src/shared/theme/tokens";

type Props = { children: React.ReactNode };

export function FontProvider({ children }: Props) {
  const [archivoLoaded] = useArchivoBlack({ ArchivoBlack_400Regular });
  const [interLoaded] = useInter({ Inter_400Regular, Inter_700Bold });
  const [caveatLoaded] = useCaveat({ Caveat_400Regular, Caveat_700Bold });

  const ready = archivoLoaded && interLoaded && caveatLoaded;

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: color.bg.app }} />;
  }

  return <>{children}</>;
}
