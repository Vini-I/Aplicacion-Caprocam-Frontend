import { Stack, useRouter } from "expo-router";
import { HeaderBackButton } from "expo-router/react-navigation.js";
import { COLORS } from "../../../../theme/colors.js";

export default function MantEquipoTareasLayout() {
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
        options={{ title: "Tareas", headerShown: true }}
      />
      <Stack.Screen
        name="tareaForm"
        options={{ title: "Formulario de Tarea", headerShown: true, headerBackVisible: true }}
      />
      <Stack.Screen
        name="detalleTarea"
        options={{ title: "Detalle de Tarea", headerShown: true, headerBackVisible: true }}
      />
    </Stack>
  );
}