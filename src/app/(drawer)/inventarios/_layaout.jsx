// app/(drawer)/inventarios/_layout.jsx

import { Stack } from "expo-router";

export default function InventariosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Pantalla principal del módulo */}
      <Stack.Screen name="inventarioScreen" />

      {/* Formulario de nuevo/editar producto */}
      <Stack.Screen name="productForm" />
    </Stack>
  );
}