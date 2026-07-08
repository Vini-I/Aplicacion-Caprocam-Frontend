import { Drawer } from "expo-router/drawer";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ICONS } from "../../theme/icons";
import Icon from "../../shared/components/Icons";
import { COLORS } from "../../theme/colors.js";

export default function DrawerLayout() {
  return (
    <Drawer
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.primary,
        borderBottomWidth: 0,
      },
      headerTintColor: COLORS.white,
    }}
  >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Panel Principal",
          title: "Caprocam",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          )
        }}
      />

      <Drawer.Screen
        name="configuracion"
        options={{
          drawerLabel: "Configuración",
          title: "Ajustes de la Aplicación",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          )
        }}
      />

      <Drawer.Screen
        name="inventarios"
        options={{
          drawerLabel: "Inventario",
          title: "Inventario",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="package-variant-closed" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="proveedores"
        options={{
          drawerLabel: "Proveedores",
          title: "Proveedores",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="truck-delivery"
              color={color}
              size={size}
            />
          ),
        }}
      />
 
      <Drawer.Screen
        name="compradores"
        options={{
          drawerLabel: "Compradores",
          title: "Compradores",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="trazabilidad"
        options={{
          drawerLabel: "Trazabilidad",
          title: "Trazabilidad",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker-path" color={color} size={size} />
          )
        }}
      />

       <Drawer.Screen
        name="colaboradores"
        options={{
          drawerLabel: "Colaboradores",
          title: "Colaboradores",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          )
        }}
      />

       <Drawer.Screen
        name="mantEquipo"
        options={{
          drawerLabel: "Mantenimiento de Equipos",
          title: "Mantenimiento de Equipos",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wrench" color={color} size={size} />
          )
        }}
      />

       <Drawer.Screen
        name="registrarEquipo"
        options={{
          drawerLabel: "Registrar Equipo",
          title: "Registrar Equipo",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus" color={color} size={size} />
          )
        }}
      />

      <Drawer.Screen
        name="venta"
        options={{
          drawerLabel: "Venta",
          title: "Venta",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="currency-usd" color={color} size={size} />
          )
        }}
      />

      <Drawer.Screen
        name="linksPrueba"
        options={{
          drawerLabel: "Links de Prueba",
          title: "Links de Prueba",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="link" color={color} size={size} />
          )
        }}
      />


      <Drawer.Screen name="inicio" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="registros" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="reportes" options={{ drawerItemStyle: { display: "none" } }} />
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

    </Drawer>
  );
}