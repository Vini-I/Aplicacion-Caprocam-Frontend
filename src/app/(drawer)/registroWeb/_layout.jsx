import { Stack } from "expo-router";
import { COLORS } from "../../../theme/colors.js";

export default function RegistroStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white}}>
      <Stack.Screen name="index" options={{ title: "Registro Web", headerShown: false }} />
    </Stack>
  );
}