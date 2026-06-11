import { Roboto_500Medium, useFonts } from "@expo-google-fonts/roboto";
import { View } from "react-native";
import Fincas from "./FincaScreen";
import { styles } from "./FincaStyles";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Fincas />
    </View>
  );
}
