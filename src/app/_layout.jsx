import { Stack } from "expo-router";
import React from "react";
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from "@expo-google-fonts/roboto";
import SessionMonitor from '../shared/components/ModalTokenExpired';

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    "Roboto-Regular": Roboto_400Regular,
    "Roboto-Medium": Roboto_500Medium,
    "Roboto-Bold": Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
  <SessionMonitor>
    <Stack screenOptions={{ headerShown: false }}>

      <Stack.Screen name="loginWeb" />

      <Stack.Screen name="login" />

      <Stack.Screen name="colaboradores" />

      <Stack.Screen name="index" />



    </Stack>
    </SessionMonitor>
  );
}