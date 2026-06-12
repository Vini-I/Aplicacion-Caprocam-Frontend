import { Tabs } from "expo-router";
import { Drawer } from "expo-router/drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function TabsLayout() {
  return (

    <Tabs screenOptions={{ tabBarActiveTintColor: "teal" , headerShown: false}}>
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
    </Tabs>
    
  );
}