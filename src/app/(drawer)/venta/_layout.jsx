import { Stack, useRouter } from "expo-router";
import { HeaderBackButton } from "expo-router/react-navigation";
import { COLORS } from "../../../theme/colors.js";

export default function VentaLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{ headerShown: false,headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white, headerBackVisible: false,
        headerLeft: (props) => (
          <HeaderBackButton
            {...props}
            onPress={() => router.dismissAll()}
          />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Venta",
        }}
      />

      <Stack.Screen
        name="detalleVenta"
        options={{
          title: "Detalle Venta",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="editarVenta"
        options={{
          title: "Editar Venta",
          headerShown: true,
        }}
      />
    </Stack>
  );
}