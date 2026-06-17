import { Stack } from "expo-router";

export default function InventariosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="inventarioScreen" />
      <Stack.Screen name="productForm" />
      <Stack.Screen name="detalleProducto" />
      <Stack.Screen name="nuevoProveedor" />
      <Stack.Screen name="editarProveedor" />
      <Stack.Screen name="detalleProveedor" />
      <Stack.Screen name="proveedorScreen" />
    </Stack>
  );
}
