import { Drawer } from "expo-router/drawer";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function DrawerLayout() {
  return (
    <Drawer screenOptions={{ headerShown: true }}>
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
          headerShown: false,
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
          headerShown: false,
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