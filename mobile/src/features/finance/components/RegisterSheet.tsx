import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePila } from "@/src/app/providers/PilaProvider";
import { usePreferences } from "@/src/shared/preferences/PreferencesProvider";
import { Sheet } from "@/src/shared/components/primitives/Sheet";
import { Text, Stack, Inline } from "@/src/shared/components/primitives";
import { FinanceForm, type FormTarget } from "./FinanceForm";
export function RegisterSheet({
  onClose,
  credit = false,
}: {
  onClose: () => void;
  credit?: boolean;
}) {
  const { estado } = usePila();
  const { color, t } = usePreferences();
  const [followCredit, setFollowCredit] = useState(
    credit && !estado.cartoes.length,
  );
  const [target, setTarget] = useState<FormTarget | null>(
    credit
      ? estado.cartoes.length
        ? { tipo: "compra" }
        : { tipo: "cartao" }
      : null,
  );
  const options: {
    label: string;
    help: string;
    icon: keyof typeof Ionicons.glyphMap;
    target: FormTarget;
  }[] = [
    {
      label: "Gasto à vista",
      help: "Pix, débito ou dinheiro",
      icon: "wallet-outline",
      target: { tipo: "movimento" },
    },
    {
      label: "Compra no crédito",
      help: "Uma vez ou parcelada",
      icon: "card-outline",
      target: { tipo: "compra" },
    },
    {
      label: "Adicionar conta",
      help: "Fixa, pontual ou parcelada",
      icon: "calendar-outline",
      target: { tipo: "conta" },
    },
    {
      label: "Adicionar renda",
      help: "Salário ou outra renda mensal",
      icon: "cash-outline",
      target: { tipo: "receita" },
    },
  ];
  const titles = {
    configurar: "Configurar meu planejamento",
    movimento: "Gasto à vista",
    compra: "Compra no crédito",
    cartao: "Novo cartão",
    receita: "Adicionar renda",
    conta: "Adicionar conta",
    reserva: "Reserva mensal",
    saldo: "Atualizar saldo",
  };
  return (
    <Sheet
      visible
      title={target ? titles[target.tipo] : "O que você quer registrar?"}
      onClose={onClose}
    >
      {target ? (
        <Stack gap="lg">
          {followCredit && target.tipo === "cartao" && (
            <Text variant="bodyS" tone="secondary">
              Primeiro, adicione seu cartão. Depois, registre a compra.
            </Text>
          )}
          <FinanceForm
            key={target.tipo}
            embedded
            target={target}
            onClose={() => {
              if (followCredit && target.tipo === "cartao") {
                setFollowCredit(false);
                setTarget({ tipo: "compra" });
              } else onClose();
            }}
          />
        </Stack>
      ) : (
        <Stack gap="md">
          {options.map((option) => (
            <Pressable
              key={option.label}
              accessibilityRole="button"
              accessibilityLabel={t(option.label)}
              onPress={() => {
                if (option.target.tipo === "compra" && !estado.cartoes.length) {
                  setFollowCredit(true);
                  setTarget({ tipo: "cartao" });
                } else setTarget(option.target);
              }}
              style={{
                padding: 18,
                backgroundColor: color.bg.surface,
                borderRadius: 20,
              }}
            >
              <Inline>
                <View style={{ width: 38 }}>
                  <Ionicons
                    name={option.icon}
                    size={27}
                    color={color.text.accent}
                  />
                </View>
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Text variant="bodyBoldM">{option.label}</Text>
                  <Text variant="bodyS" tone="secondary">
                    {option.help}
                  </Text>
                </Stack>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={color.text.secondary}
                />
              </Inline>
            </Pressable>
          ))}
        </Stack>
      )}
    </Sheet>
  );
}
