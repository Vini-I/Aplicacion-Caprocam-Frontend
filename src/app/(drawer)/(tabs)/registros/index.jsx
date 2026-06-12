import { Text, View, Button } from "react-native";
import { useRouter } from "expo-router";


export default function RecordsScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Registrar Finca" onPress={() => router.push("/registros/finca")} />
    </View>
  );
}