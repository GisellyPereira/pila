import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { Brand } from "@/src/shared/components/jota/Brand";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { View } from "react-native";

export function FontProvider({ children }: { children: React.ReactNode }) {
  const { color } = usePreferences();

  const [loaded, error] = useFonts({ Inter_400Regular, Inter_700Bold });
  if (!loaded && !error)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color.bg.app,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Brand width={180} />
      </View>
    );
  return <>{children}</>;
}
