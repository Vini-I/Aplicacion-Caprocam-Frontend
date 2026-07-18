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
            <Icon icon={ICONS.dashboard} color={color} size={20} />
          ),
          tabBarLabel: "Inicio",
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="finca"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon icon={ICONS.location} size={17} color={color} />
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
            <Icon icon={ICONS.document} color={color} size={20} />
          ),
          tabBarActiveTintColor: "teal",
          tabBarLabel: "Registros",
          title: "Registros",
        }}
      />

      <Tabs.Screen
        name="siembra"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon icon={ICONS.shrimp} color={color} size={20}
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