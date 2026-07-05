import { Stack } from "expo-router";
import { COLORS } from "../../../theme/colors.js";

export default function InventariosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white }}>
      <Stack.Screen name="index" options={{ title: "Inventario", headerShown: false }} />
      <Stack.Screen name="productForm" options={{ title: "Agregar Producto", headerShown: true }} />
      <Stack.Screen name="nuevoProveedor" options={{ title: "Nuevo Proveedor", headerShown: true }} />
      <Stack.Screen name="editarProveedor" options={{ title: "Editar Proveedor", headerShown: true }} />
      <Stack.Screen name="detalleProveedor" options={{ title: "Detalle Proveedor", headerShown: true }} />
    </Stack>
  );
}
