import { Stack } from "expo-router";
import { COLORS } from "../../../theme/colors.js";

export default function MantEquipoStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
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