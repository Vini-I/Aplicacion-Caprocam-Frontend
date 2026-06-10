import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * Card para mostrar el resumen de una siembra.
 * Al presionarla puede abrir el detalle de la siembra.
 */
export default function SiembraCard({
  siembraId,
  estanque,
  finca,
  diasCultivo,
  diasMaduracion,
  cantidadSembrada,
  produccionEstimada,
  estado = "Activa",
  onPress,
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.diasText}>
          Día {diasCultivo} de {diasMaduracion}
        </Text>

        <View style={styles.estadoBadge}>
          <Text style={styles.estadoText}>{estado}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.estanqueText}>{estanque}</Text>
        <Text style={styles.fincaText}>{finca}</Text>
        <Text style={styles.siembraText}>Siembra #{siembraId}</Text>

        <Text style={styles.cantidadText}>
          {(cantidadSembrada ?? 0).toLocaleString()} camarones
        </Text>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.produccionLabel}>Producción estimada</Text>
          <Text style={styles.produccionValue}>{produccionEstimada}</Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  diasText: {
    color: "#009EF5",
    fontSize: 13,
    fontWeight: "700",
  },
  estadoBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  estadoText: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "700",
  },
  body: {
    marginBottom: 16,
  },
  estanqueText: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
  },
  fincaText: {
    color: "#475569",
    fontSize: 14,
    marginBottom: 10,
  },
  siembraText: {
    color: "#64748B",
    fontSize: 13,
    marginBottom: 6,
  },
  cantidadText: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  produccionLabel: {
    color: "#64748B",
    fontSize: 13,
  },
  produccionValue: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
  },
  arrow: {
    color: "#94A3B8",
    fontSize: 28,
  },
});
