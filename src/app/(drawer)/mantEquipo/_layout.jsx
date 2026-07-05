import { Stack } from "expo-router";

export default function MantEquipoStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="mantEquipo" options={{ title: "Mantenimiento de Equipos" }} />

      <Stack.Screen name="tareas" options={{ title: "Agregar Tareas" }} />

    </Stack>
  );
}