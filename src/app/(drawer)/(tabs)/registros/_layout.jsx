import { Stack } from "expo-router";

export default function RegistrosStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Sección de Registros" }} />

      <Stack.Screen name="finca" options={{ title: "Registrar Finca" }} />

      <Stack.Screen name="EditarEstanque" options={{ title: "Editar Estanque", }} />

      <Stack.Screen name="Enfermedades" options={{ title: "Enfermedades" }} />

      <Stack.Screen name="Mortalidad" options={{ title: "Registro de Mortalidad" }} />

      <Stack.Screen name="Alimentacion" options={{ title: "Registro de Alimentación" }} />

      <Stack.Screen name="FisicoQuimica" options={{ title: "Registro de mediciones Físico-Químicos" }} />
      <Stack.Screen name="DetalleEstanque" options={{ title: "Detalle Estanque" }} />

    </Stack>
  );
}