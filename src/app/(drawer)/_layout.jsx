import { Drawer } from "expo-router/drawer";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ICONS } from "../../theme/icons";
import Icon from "../../shared/components/Icons";
import ModalSesion from "../../modules/login/components/modalSesion";
import Button from "../../shared/components/Button";
import CustomText from "../../shared/components/Text";
import { COLORS } from "../../theme/colors.js";
import { removeToken } from "../../modules/login/utils/tokenStorage";
import { logout as logoutService } from "../../modules/login/services/authService";

export default function DrawerLayout() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logoutService();  // invalida el refreshToken en el backend
    removeToken();          // limpia accessToken, refreshToken y usuario del localStorage
    router.replace('/loginWeb');
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
              <CustomText size={13} color={COLORS.white} weight="600">Cerrar sesión</CustomText>
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
          drawerIcon: ({ color, size }) => (
            <Icon icon={ICONS.dashboard} size={22} />
          )
        }}
      />

      <Drawer.Screen
        name="configuracion"
        options={{
          drawerLabel: "Configuración",
          title: "Ajustes de la Aplicación",
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
          drawerIcon: ({ color, size }) => (
            <Icon icon={ICONS.dropbox} size={22} />
          ),
        }}
      />

      <Drawer.Screen
        name="proveedores"
        options={{
          drawerLabel: "Proveedores",
          title: "Proveedores",
          drawerIcon: ({ color, size }) => (
            <Icon icon={ICONS.truck} size={18} />
          ),
        }}
      />
 
      <Drawer.Screen
        name="compradores"
        options={{
          drawerLabel: "Compradores",
          title: "Compradores",
          drawerIcon: ({ color, size }) => (
            <Icon icon={ICONS.people} size={22} />
          ),
        }}
      />

      <Drawer.Screen
        name="trazabilidad"
        options={{
          drawerLabel: "Trazabilidad",
          title: "Trazabilidad",
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
          drawerIcon: ({ color, size }) => (
            <Icon icon={ICONS.people} size={22}/>
          )
        }}
      />

       <Drawer.Screen
        name="equipos"
        options={{
          drawerLabel: "Equipos",
          title: "Equipos",
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
          drawerIcon: ({ color, size }) => (
            <Icon icon={ICONS.money} size={25} />
          )
        }}
      />

      <Drawer.Screen
        name="alertas"
        options={{
          drawerLabel: "Alertas",
          title: "Alertas",
          drawerIcon: ({ color, size }) => (
            <Icon icon={ICONS.notification} size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="registroWeb"
        options={{
          drawerLabel: "Registrar Usuario",
          title: "Registro Web",
          drawerIcon: ({ color, size }) => (
            <Icon icon={ICONS.user} size={22} color={color} />
          ),
        }}
      />

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

//estilos de los botones 
const styles = StyleSheet.create({
  logoutWrapper: {
    paddingRight: 12,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
    marginTop: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
