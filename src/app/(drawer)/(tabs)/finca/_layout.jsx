import { Stack } from "expo-router";
import { COLORS } from "../../../../theme/colors.js";

export default function RegistrosStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: "#fff",}}>
        
      <Stack.Screen name="index" options={{ title: "Sección Finca" }} />

      <Stack.Screen name="nueva" options={{ title: "Nueva Finca" }} />

      <Stack.Screen name="editarFinca" options={{ title: "Editar Finca" }}/>

      <Stack.Screen name="estanque" options={{ title: "Nuevo Estanque", headerShown: false }}/>

    </Stack>
  );
}
