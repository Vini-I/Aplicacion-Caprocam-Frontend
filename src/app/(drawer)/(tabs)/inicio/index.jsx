import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text >HOME TAB WORKS</Text>
      <Link style={{ padding: 10, backgroundColor: "blue", borderRadius: 5, color: "white" }} href="/login">
        <Text>Iniciar Sesión</Text>
      </Link>

      <Link style={{ padding: 10, backgroundColor: "red", borderRadius: 5, color: "white" }} href="/">
        <Text>Ver placeholder de links</Text>
      </Link>

    </View>
  );
}