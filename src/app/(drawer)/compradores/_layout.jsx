import { Stack } from "expo-router";

export default function CompradoresLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="nuevoComprador" />
      <Stack.Screen name="editarComprador" />
      <Stack.Screen name="detalleComprador" />
      <Stack.Screen name="compradorScreen" />
    </Stack>
  );
}