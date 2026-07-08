import { Stack } from "expo-router";
import { COLORS } from "../../../theme/colors.js";

export default function CompradoresLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white }}>
      <Stack.Screen name="index" options={{ title: "Compradores", headerShown: false }} />
      <Stack.Screen name="nuevoComprador" options={{ title: "Nuevo Comprador", headerShown: true }} />
      <Stack.Screen name="editarComprador" options={{ title: "Editar Comprador", headerShown: true }} />
      <Stack.Screen name="detalleComprador" options={{ title: "Detalle Comprador", headerShown: true }} />
    </Stack>
  );
}