import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import {
  Modal,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { radius, space } from "@/src/shared/theme/tokens";
import { Heading } from "./Heading";
import { Text } from "./Text";

export function Sheet({
  visible,
  title,
  translateTitle = true,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  translateTitle?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { color, t } = usePreferences();

  const insets = useSafeAreaInsets();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <Pressable
          accessibilityLabel={t("Fechar janela")}
          onPress={onClose}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: color.bg.overlay,
          }}
        />
        <View
          style={{
            maxHeight: "90%",
            width: "100%",
            maxWidth: 560,
            alignSelf: "center",
            backgroundColor: color.bg.app,
            borderTopLeftRadius: radius["2xl"],
            borderTopRightRadius: radius["2xl"],
            padding: space.xl,
            paddingBottom: Math.max(insets.bottom, space.xl),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: space.xl,
              gap: space.md,
            }}
          >
            <Heading
              level="m"
              translatable={translateTitle}
              style={{ flex: 1 }}
            >
              {title}
            </Heading>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("Fechar")}
              onPress={onClose}
              hitSlop={12}
            >
              <Text variant="bodyBoldM">Fechar</Text>
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
