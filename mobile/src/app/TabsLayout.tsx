import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";

import { Tabs } from "expo-router";
import { View } from "react-native";
import { CurvedTabBar } from "@/src/shared/components/navigation/CurvedTabBar";
export default function TabsLayout() {
  const { color, t } = usePreferences();

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.app }}>
      <Tabs
        tabBar={(props) => <CurvedTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          animation: "fade",
          sceneStyle: { backgroundColor: color.bg.app },
        }}
      >
        <Tabs.Screen name="index" options={{ title: t("Início") }} />
        <Tabs.Screen name="cartoes" options={{ title: t("Gastos") }} />
        <Tabs.Screen name="contas" options={{ title: t("Agenda") }} />
        <Tabs.Screen name="previsao" options={{ title: t("Planejar") }} />
      </Tabs>
    </View>
  );
}
