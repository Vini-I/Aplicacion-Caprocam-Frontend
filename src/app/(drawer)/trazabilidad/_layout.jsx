import { Stack, useRouter } from "expo-router";
import { HeaderBackButton } from "expo-router/react-navigation";
import { COLORS } from "../../../theme/colors.js";

export default function TrazabilidadStackLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{
      headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white, headerBackVisible: false,
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => router.dismissAll()}
        />
      ),
    }}>

      <Stack.Screen name="index" options={{ title: "Sección de Trazabilidad", headerShown: false }} />

      <Stack.Screen name="agregar" options={{ title: "Registrar Trazabilidad", headerShown: true }} />

      <Stack.Screen name="detalle" options={{ title: "Detalle Trazabilidad", headerShown: true }} />

      <Stack.Screen name="[id]" options={{ title: "Detalle de Trazabilidad", headerShown: true }} />

    </Stack>
  );
}