import { Stack } from "expo-router";

export default function TrazabilidadStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Sección de Trazabilidad" }} />

      <Stack.Screen name="agregar" options={{ title: "Registrar Trazabilidad" }} />

      <Stack.Screen name="detalle" options={{ title: "Detalle Trazabilidad" }} />

      <Stack.Screen name="[id]" options={{ title: "Detalle de Trazabilidad" }} />

    </Stack>
  );
}