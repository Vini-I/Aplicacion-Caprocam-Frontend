// src/app/(drawer)/colaboradores/_layout.jsx
import { Stack } from "expo-router";
import { COLORS } from "../../../theme/colors.js";

export default function ColaboradoresLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Colaboradores" }} />
      <Stack.Screen name="detalle" options={{ title: "Detalle de Colaborador", headerShown: true }} />
      <Stack.Screen name="form" options={{ title: "Formulario de Colaborador", headerShown: true }} />

    </Stack>
  );
}