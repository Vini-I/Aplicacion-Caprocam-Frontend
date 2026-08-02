import { Drawer } from "expo-router/drawer";
import React from "react";
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
        name="linksPrueba"
        options={{
          drawerLabel: "Links de Prueba",
          title: "Links de Prueba",
          drawerIcon: ({ color, size }) => (
            <Icon icon={ICONS.link} size={24} />
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