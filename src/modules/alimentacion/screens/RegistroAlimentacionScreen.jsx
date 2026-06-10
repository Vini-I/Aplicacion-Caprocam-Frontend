import { View, Text, StyleSheet } from "react-native";

export default function RegistroAlimentacionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Alimentación</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});