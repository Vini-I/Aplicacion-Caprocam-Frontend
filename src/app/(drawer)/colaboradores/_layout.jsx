// src/app/(drawer)/colaboradores/_layout.jsx
import { Stack, useRouter } from "expo-router";
import { HeaderBackButton } from "expo-router/react-navigation.js";
import { COLORS } from "../../../theme/colors.js";

export default function ColaboradoresLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerBackVisible: false,
        headerLeft: (props) => (
          <HeaderBackButton
            {...props}
            onPress={() => router.dismissAll()}
          />
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Colaboradores" }} />
      <Stack.Screen name="detalle" options={{ title: "Detalle de Colaborador", headerShown: true }} />
      <Stack.Screen name="form" options={{ title: "Formulario de Colaborador", headerShown: true }} />

    </Stack>
  );
}