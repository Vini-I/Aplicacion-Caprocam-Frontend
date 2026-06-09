import { View, Text, StyleSheet } from "react-native";

export default function HistorialAlimentacionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Alimentación</Text>
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