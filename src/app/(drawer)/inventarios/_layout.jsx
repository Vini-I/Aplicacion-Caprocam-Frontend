import { Stack, useRouter } from "expo-router";
import { HeaderBackButton } from "expo-router/react-navigation.js";
import { COLORS } from "../../../theme/colors.js";

export default function InventariosStackLayout() {
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
      <Stack.Screen name="index" options={{ title: "Inventario", headerShown: false }} />
      <Stack.Screen name="agregarProducto" options={{ title: "Agregar Producto", headerShown: true }} />
      <Stack.Screen name="editarProducto" options={{ title: "Editar Producto", headerShown: true }} />
      <Stack.Screen name="detalleProducto" options={{ title: "Detalle Producto", headerShown: true }} />
    </Stack>
  );
}