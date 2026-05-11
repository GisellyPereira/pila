import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { color, font, space } from "@/src/shared/theme/tokens";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.brand.pila,
        tabBarInactiveTintColor: color.text.muted,
        tabBarStyle: {
          backgroundColor: color.bg.surface,
          borderTopColor: color.border.subtle,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: space.md,
          paddingTop: space.sm,
        },
        tabBarLabelStyle: {
          fontFamily: font.bodyBold,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 1.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tribunal",
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name={"home" as IconName} color={c} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cofre"
        options={{
          title: "Cofre",
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name={"lock-closed" as IconName} color={c} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="missoes"
        options={{
          title: "Missões",
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name={"trophy" as IconName} color={c} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: "Histórico",
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name={"receipt" as IconName} color={c} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="eu"
        options={{
          title: "Eu",
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name={"person" as IconName} color={c} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
