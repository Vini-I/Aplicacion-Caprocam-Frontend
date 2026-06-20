import { Stack } from "expo-router";

export default function SiembraStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="nueva" />
      <Stack.Screen name="detalle" />
    </Stack>
  );
}