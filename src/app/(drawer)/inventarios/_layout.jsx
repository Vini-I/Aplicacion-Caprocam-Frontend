import { Stack } from "expo-router";

export default function InventariosStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="productForm" options={{ headerShown: false }} />
      <Stack.Screen name="detalleProducto" options={{ headerShown: false }} />
    </Stack>
  );
}