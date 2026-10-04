import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AccessibilityInfo, Platform, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { Text } from "@/src/shared/components/primitives/Text";
const Context = createContext<{ notify: (message: string) => void } | null>(
  null,
);
export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const { color, t } = usePreferences();
  const insets = useSafeAreaInsets();
  const sequence = useRef(0);
  const [notice, setNotice] = useState<{ id: number; message: string } | null>(
    null,
  );
  const notify = useCallback(
    (message: string) => setNotice({ id: ++sequence.current, message }),
    [],
  );
  const contextValue = useMemo(() => ({ notify }), [notify]);
  useEffect(() => {
    if (!notice) return;
    if (Platform.OS === "ios")
      AccessibilityInfo.announceForAccessibility(t(notice.message));
    const timer = setTimeout(() => setNotice(null), 4200);
    return () => clearTimeout(timer);
  }, [notice, t]);
  return (
    <Context.Provider value={contextValue}>
      {children}
      {notice && (
        <View
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={{
            position: "absolute",
            top: insets.top + 8,
            left: 16,
            right: 16,
            maxWidth: 528,
            alignSelf: "center",
            padding: 16,
            borderRadius: 18,
            backgroundColor: color.bg.surfaceElevated,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={24}
            color={color.text.accent}
          />
          <Text variant="bodyBoldM" style={{ flex: 1 }}>
            {notice.message}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("Fechar")}
            onPress={() => setNotice(null)}
            style={{ padding: 8 }}
          >
            <Ionicons name="close" size={20} color={color.text.primary} />
          </Pressable>
        </View>
      )}
    </Context.Provider>
  );
}
export function useFeedback() {
  const context = useContext(Context);
  if (!context) throw new Error("FeedbackProvider is missing");
  return context;
}
