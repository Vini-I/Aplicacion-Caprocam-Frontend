import { Stack } from "expo-router";

export default function InventariosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="inventarioScreen" />
      <Stack.Screen name="ProductForm" />
    </Stack>
  );
}