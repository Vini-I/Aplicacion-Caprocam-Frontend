import { Stack, useRoute, useRouter } from "expo-router";
import { HeaderBackButton } from "expo-router/react-navigation.js";
import { COLORS } from "../../../theme/colors.js";
import { ProveedorProvider } from "../../../modules/proveedores/context/ProveedorContext.js";

export default function ProveedoresLayout() {
  const router = useRouter();

  return (
    <ProveedorProvider>
      <Stack screenOptions={{
        headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white, headerBackVisible: false,
        headerLeft: (props) => (
          <HeaderBackButton
            {...props}
            onPress={() => router.dismissAll()}
          />
        ),
      }}>
        <Stack.Screen name="index" options={{ title: "Proveedor", headerShown: false }} />
        <Stack.Screen name="nuevoProveedor" options={{ title: "Nuevo Proveedor", headerShown: true }} />
        <Stack.Screen name="editarProveedor" options={{ title: "Editar Proveedor", headerShown: true }} />
        <Stack.Screen name="detalleProveedor" options={{ title: "Detalle Proveedor", headerShown: true }} />
      </Stack>
    </ProveedorProvider>
  );
}
