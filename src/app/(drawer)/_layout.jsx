import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ModalSesion from "../../modules/login/components/modalSesion";
import { logout as logoutService } from "../../modules/login/services/authService";
import { getTokenPayload, getUsuario, removeToken } from "../../modules/login/utils/tokenStorage";
import Button from "../../shared/components/Button";
import Icon from "../../shared/components/Icons";
import CustomText from "../../shared/components/Text";
import { useError } from "../../shared/context/ErrorContext";
import { COLORS } from "../../theme/colors.js";
import { ICONS } from "../../theme/icons";

export default function DrawerLayout() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { mostrarError } = useError();

  // ─── Leer usuario guardado o payload decodificado del JWT ────────────────
  const usuario = getUsuario() || getTokenPayload();
  const isCaprocamAdmin = Boolean(
    usuario?.accesoGlobal || Number(usuario?.grupoDatos) === 22776226
  );

  // Redireccionar al Administrador Caprocam directamente a "registroWeb"
  useEffect(() => {
    if (isCaprocamAdmin) {
      router.replace("/registroWeb");
    }
  }, [isCaprocamAdmin]);

  // Estilo condicional para ocultar pestañas en el Drawer
  const hiddenStyle = isCaprocamAdmin ? { display: "none" } : null;

  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logoutService();  // invalida el refreshToken en el backend
      removeToken();          // limpia accessToken, refreshToken y usuario del localStorage
      router.replace('/loginWeb');
    } catch (error) {
      mostrarError(error);    // muestra ModalError global si algo falla
    }
  };

  return (
    <>
      <ModalSesion
        visible={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      <Drawer
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
            borderBottomWidth: 0,
          },
          headerTintColor: COLORS.white,
          headerRight: () => (
            <View style={styles.logoutWrapper}>
              <Button
                variant="danger"
                onPress={() => setShowLogoutModal(true)}
                style={styles.logoutButton}
              >
                <View style={styles.logoutContent}>
                  <Icon icon={ICONS.exit} size={16} color={COLORS.white} />
                  <CustomText size={12} color={COLORS.white} weight="600">Salir</CustomText>
                </View>
              </Button>
            </View>
          ),
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Panel Principal",
            title: "Caprocam",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.dashboard} size={22} />
            )
          }}
          listeners={({ navigation }) => ({
            drawerItemPress: (e) => {
              e.preventDefault();
              navigation.navigate("(tabs)", { screen: "inicio" });
            },
          })}
        />

        <Drawer.Screen
          name="configuracion"
          options={{
            drawerLabel: "Configuración",
            title: "Ajustes de la Aplicación",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.gear} />
            )
          }}
        />

        <Drawer.Screen
          name="inventarios"
          options={{
            drawerLabel: "Inventario",
            title: "Inventario",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.dropbox} size={23} />
            ),
          }}
        />

        <Drawer.Screen
          name="proveedores"
          options={{
            drawerLabel: "Proveedores",
            title: "Proveedores",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.truck} size={20} />
            ),
          }}
        />

        <Drawer.Screen
          name="compradores"
          options={{
            drawerLabel: "Compradores",
            title: "Compradores",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.people} size={23} />
            ),
          }}
        />

        <Drawer.Screen
          name="trazabilidad"
          options={{
            drawerLabel: "Trazabilidad",
            title: "Trazabilidad",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.trazabilidad} size={23}/>
            )
          }}
        />

        <Drawer.Screen
          name="colaboradores"
          options={{
            drawerLabel: "Colaboradores",
            title: "Colaboradores",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.people} size={23}/>
            )
          }}
        />

        <Drawer.Screen
          name="equipos"
          options={{
            drawerLabel: "Equipos",
            title: "Equipos",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.tools} size={23} />
            )
          }}
        />

        <Drawer.Screen
          name="mantenimientoEquipo"
          options={{
            drawerLabel: "Mantenimiento de Equipos",
            title: "Mantenimiento de Equipos",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.clipboard} size={23} />
            )
          }}
        />

        <Drawer.Screen
          name="venta"
          options={{
            drawerLabel: "Venta",
            title: "Venta",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.money} size={23} />
            )
          }}
        />

        <Drawer.Screen
          name="alertas"
          options={{
            drawerLabel: "Alertas",
            title: "Alertas",
            drawerItemStyle: hiddenStyle,
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.notification} size={23} />
            ),
          }}
        />

        {/* 🟢 MANTENER VISIBLE: Registrar Usuario */}
        <Drawer.Screen
          name="registroWeb"
          options={{
            drawerLabel: "Registrar Usuario",
            title: "Registro Web",
            drawerIcon: ({ color, size }) => (
              <Icon icon={ICONS.user} size={23} />
            ),
          }}
        />

        {/* Pantallas secundarias ocultas del Drawer */}
        <Drawer.Screen name="inicio" options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="registros" options={{ drawerItemStyle: { display: "none" } }} />
        
        <Drawer.Screen name="inventarios/_layout" options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="inventarios/inventarioScreen" options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="inventarios/productForm" options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="inventarios/nuevoProveedor" options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="inventarios/editarProveedor" options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="inventarios/proveedorScreen" options={{ drawerItemStyle: { display: "none" } }} />
        
        <Drawer.Screen name="compradores/nuevoComprador"    options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="compradores/editarComprador"   options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="compradores/detalleComprador"  options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="compradores/compradorScreen"   options={{ drawerItemStyle: { display: "none" } }} />
        
        <Drawer.Screen name="mantenimientoEquipo/layout"   options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="mantenimientoEquipo/tareaForm"   options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="mantenimientoEquipo/mantEquipo"   options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="mantenimientoEquipo/detalleTarea"   options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="mantenimientoEquipo/EditarMantenimiento"   options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="mantenimientoEquipo/AgregarMantenimiento"   options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="mantenimientoEquipo/DetalleMantenimiento"   options={{ drawerItemStyle: { display: "none" } }} />

        <Drawer.Screen name="mantenimientoEquipo/tareas/layout"   options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="mantenimientoEquipo/tareas"   options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="mantenimientoEquipo/tareas/tareaForm"   options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="mantenimientoEquipo/tareas/detalleTarea"   options={{ drawerItemStyle: { display: "none" } }} />

      </Drawer>
    </>
  );
}

const styles = StyleSheet.create({
  logoutWrapper: {
    paddingRight: 16,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
    marginTop: 0,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});