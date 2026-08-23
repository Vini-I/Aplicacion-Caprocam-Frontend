import { Stack, useRouter } from "expo-router";
import { HeaderBackButton } from "expo-router/react-navigation.js";
import { COLORS } from "../../../theme/colors.js";

export default function MantEquipoStackLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        headerBackVisible: false,
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
        options={{ title: "Mantenimiento de Equipos", headerShown: false }}
      />
      <Stack.Screen
        name="AgregarMantenimiento"
        options={{ title: "Agregar Mantenimiento", headerShown: true, headerBackVisible: true }}
      />
      <Stack.Screen
        name="EditarMantenimiento"
        options={{ title: "Editar Mantenimiento", headerShown: true }}
      />
      <Stack.Screen
        name="DetalleMantenimiento"
        options={{ title: "Detalle de Mantenimiento", headerShown: true }}
      />
    </Stack>
  );
}