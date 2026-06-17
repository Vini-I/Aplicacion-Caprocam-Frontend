import { Stack } from "expo-router";

export default function RegistrosStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
        
      <Stack.Screen name="index" options={{ title: "Sección Finca" }} />

      <Stack.Screen name="nueva" options={{ title: "Nueva Finca" }} />
      
      <Stack.Screen name="detalle" options={{ title: "Detalle Finca" }} />

      <Stack.Screen name="editarfinca" options={{ title: "Editar Finca" }}/>

      <Stack.Screen name="estanque" options={{ title: "Nuevo Estanque" }}/>

    </Stack>
  );
}
