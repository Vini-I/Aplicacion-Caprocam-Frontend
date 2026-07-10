import { Stack } from "expo-router";
import { COLORS } from "../../../theme/colors.js";

export default function MantEquipoStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white}}>
      
      <Stack.Screen name="mantEquipo" options={{ title: "Mantenimiento de Equipos" }} />

      <Stack.Screen name="tareas" options={{ title: "Gestion Tareas", headerShown: true }} />

    </Stack>
  );
}