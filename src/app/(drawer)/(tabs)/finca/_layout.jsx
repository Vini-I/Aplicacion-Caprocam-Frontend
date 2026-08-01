import { Stack } from "expo-router";
import { COLORS } from "../../../../theme/colors.js";
import { FincaProvider } from "../../../../modules/finca/context/FincaContext.js";
import { EstanqueProvider } from "../../../../modules/estanques/context/EstanqueContext.js";

export default function RegistrosStackLayout() {
  return (
    <FincaProvider>
      <EstanqueProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: COLORS.white,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Sección Finca" }} />

          <Stack.Screen name="nueva" options={{ title: "Nueva Finca" }} />

          <Stack.Screen name="editarFinca" options={{ title: "Editar Finca" }} />

          <Stack.Screen
            name="estanque"
            options={{ title: "Nuevo Estanque", headerShown: false }}
          />
        </Stack>
      </EstanqueProvider>
    </FincaProvider>
  );
}
