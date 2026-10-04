import { useEffect } from "react";
import * as SystemUI from "expo-system-ui";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PilaProvider } from "@/src/app/providers/PilaProvider";
import { FontProvider } from "@/src/app/providers/FontProvider";
import {
  PreferencesProvider,
  usePreferences,
} from "@/src/shared/preferences/PreferencesProvider";
import { FeedbackProvider } from "@/src/shared/feedback/FeedbackProvider";
import { Brand } from "@/src/shared/components/jota/Brand";
function RootContent() {
  const { color, dark, ready, t, scale } = usePreferences();
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(color.bg.app).catch(() => {});
  }, [color.bg.app]);
  if (!ready)
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: color.bg.app,
        }}
      >
        <Brand width={180} />
      </View>
    );
  return (
    <FontProvider>
      <PilaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: color.bg.app },
            headerTitleStyle: { fontSize: 18 * scale },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="perfil"
            options={{
              headerShown: true,
              title: t("Minha renda e dados"),
              headerStyle: { backgroundColor: color.bg.app },
              headerTintColor: color.text.primary,
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="ajustes"
            options={{
              headerShown: true,
              title: t("Ajustes"),
              headerStyle: { backgroundColor: color.bg.app },
              headerTintColor: color.text.primary,
              headerShadowVisible: false,
            }}
          />
        </Stack>
        <StatusBar style={dark ? "light" : "dark"} />
      </PilaProvider>
    </FontProvider>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <FeedbackProvider>
          <RootContent />
        </FeedbackProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}
