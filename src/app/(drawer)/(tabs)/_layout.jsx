import { Tabs } from "expo-router";
import { Drawer } from "expo-router/drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

import Icon from "../../../shared/components/Icons";

export default function TabsLayout() {
  return (

    <Tabs screenOptions={{ tabBarActiveTintColor: "teal", headerShown: false }}>
      <Tabs.Screen
        name="inicio"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          tabBarLabel: "Inicio",
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="finca"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon icon={ICONS.location} size={15} color={COLORS.textTertiary} />
          ),
          tabBarActiveTintColor: "teal",
          tabBarLabel: "Finca",
          title: "Finca",
        }}
      />

      <Tabs.Screen
        name="registros"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-document" color={color} size={size} />
          ),
          tabBarActiveTintColor: "teal",
          tabBarLabel: "Registros",
          title: "Registros",
        }}
      />

      <Tabs.Screen
        name="reportes"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
          ),
          tabBarActiveTintColor: "teal",
          tabBarLabel: "Reportes",
          title: "Reportes",
        }}
      />

      <Tabs.Screen
        name="siembra"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="sprout"
              color={color}
              size={size}
            />
          ),
          tabBarLabel: "Siembra",
          title: "Siembra",
        }}
      />   
            <Tabs.Screen name="colaboradores" options={{ drawerItemStyle: { display: "none" } }} />
            
      
    </Tabs>

  );
}