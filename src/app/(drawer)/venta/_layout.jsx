import { Stack } from "expo-router";
import { COLORS } from "../../../theme/colors.js";

export default function VentaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white }}>

      <Stack.Screen name="index" options={{ title: "Venta" }} />

      <Stack.Screen name="detalleVenta" options={{ title: "Detalle Venta", headerShown: true }} />

      <Stack.Screen name="editarVenta" options={{ title: "Editar Venta", headerShown: true }} />

    </Stack>
  );
}