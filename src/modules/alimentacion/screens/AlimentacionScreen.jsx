import { View, Text, StyleSheet } from "react-native";

export default function AlimentacionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alimentación</Text>

      <Text style={styles.subtitle}>
        Gestión y control de alimentación de estanques
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEDD4",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
  },
});