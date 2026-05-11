import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FontProvider } from "@/src/app/providers/FontProvider";
import { color } from "@/src/shared/theme/tokens";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FontProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: color.bg.app },
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="light" />
      </FontProvider>
    </SafeAreaProvider>
  );
}
