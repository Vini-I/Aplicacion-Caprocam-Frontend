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
      <Drawer.Screen name="inventarios/_layaout" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="inventarios/inventarioScreen" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="inventarios/ProductForm" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="inventarios/productForm" options={{ drawerItemStyle: { display: "none" } }} />


    </Drawer>
  );
}