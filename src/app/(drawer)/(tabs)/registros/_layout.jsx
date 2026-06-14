import { Stack } from "expo-router";

export default function RegistrosStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Sección de Registros" }} />

      <Stack.Screen name="finca" options={{ title: "Registrar Finca" }} />

      <Stack.Screen name="EditarEstanque" options={{ title: "Editar Estanque", }} />

      <Stack.Screen name="Enfermedades" options={{ title: "Enfermedades", }} />

    </Stack>
  );
}
