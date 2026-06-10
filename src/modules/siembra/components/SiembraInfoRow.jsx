import { View, Text, StyleSheet } from "react-native";

/**
 * Fila reutilizable para mostrar información en el detalle de una siembra.
 */
export default function SiembraInfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  label: {
    color: "#64748B",
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
});
