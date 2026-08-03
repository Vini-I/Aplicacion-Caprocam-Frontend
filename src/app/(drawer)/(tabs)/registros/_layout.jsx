import { Stack } from "expo-router";
import { COLORS } from "../../../../theme/colors.js";
import Icon from "../../../../shared/components/Icons.jsx";
import { ICONS } from "../../../../theme/icons.js";

export default function RegistrosStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white}}>
      <Stack.Screen name="index" options={{ title: "Sección de Registros"}} />

      <Stack.Screen name="EditarEstanque" options={{ title: "Editar Estanque"}} />

      <Stack.Screen name="Enfermedades" options={{ title: "Enfermedades" }} />

      <Stack.Screen name="Parasitologia" options={{ title: "Parasitologia" }} />

      <Stack.Screen name="DensidadPoblacional" options={{ title: "Registro de Densidad Poblacional" }} />

      <Stack.Screen name="Alimentacion" options={{ title: "Registro de Alimentación"}} />

      <Stack.Screen name="FisicoQuimica" options={{ title: "Registro Físico-Químicos"}} />

      <Stack.Screen name="DetalleEstanque" options={{ title: "Detalle Estanque" }} />

      <Stack.Screen name="Crecimiento" options={{ title: "Registro Crecimiento"}}/>

      <Stack.Screen name="Raleo" options={{ title: "Raleo" }} />

      <Stack.Screen name="Reporteria" options={{ title: "Reporteria" }}/>

      <Stack.Screen name="EditarAlimentacion" options={{ title: "Editar Alimentación" }} />

      <Stack.Screen name="EditarCrecimiento" options={{ title: "Editar Crecimiento" }} />
      
      <Stack.Screen name="EditarEnfermedad" options={{ title: "Editar Enfermedad" }} />

      <Stack.Screen name="EditarParasitologia" options={{ title: "Editar Parasitología" }} />

      <Stack.Screen name="EditarRaleo" options={{ title: "Editar Raleo" }} />

      <Stack.Screen name="EditarDensidadPoblacional" options={{ title: "Editar Densidad" }} />

    </Stack>
  );
}