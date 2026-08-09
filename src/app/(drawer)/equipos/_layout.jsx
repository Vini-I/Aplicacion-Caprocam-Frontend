// src/app/(drawer)/equipos/_layout.jsx

import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { COLORS } from "../../../theme/colors.js";
import Icon from "../../../shared/components/Icons.jsx";
import { ICONS } from "../../../theme/icons.js";

function BackButton() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.replace("/equipos/equipos")}>
      <Icon icon={ICONS.exit} size={22} color={COLORS.white} />
    </Pressable>
  );
}

export default function MantEquipoStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white, headerTitleStyle: { fontWeight: "700", fontSize: 18 } }}>
      <Stack.Screen name="equipos" options={{ title: "Equipos" }} />
      <Stack.Screen name="registrarEquipo" options={{ title: "Registrar Equipo", headerShown: true }} />
      <Stack.Screen name="detalleEquipo" options={{ title: "Detalle de Equipo", headerShown: true }} />
    </Stack>
  );
}