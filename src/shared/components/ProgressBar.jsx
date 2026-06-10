import { View, Text, StyleSheet } from "react-native";
/**
 * Componente reutilizable para mostrar una barra de progreso.
 *
 * Props:
 * - label: Texto descriptivo mostrado a la izquierda.
 * - value: Porcentaje de avance entre 0 y 100.
 * - color: Color de la sección completada de la barra.
 * - backgroundColor: Color de la parte vacía en la barra.
 * - showPercentage: Determina si se muestra el porcentaje de avance.
 *
 * Estilos principales:
 * - progressBackground: Contenedor visual de la barra completa.
 * - progressFill: Parte coloreada que representa el avance actual.
 * - percentageText: Texto que muestra el porcentaje calculado.
 */

export default function ProgressBar({
  label = "Avance",
  value = 0,
  color = "#009EF5",
  backgroundColor = "#DCEAF5",
  showPercentage = true,
}) {
  //Limita el valor para que siempre esté entre 0 y 100.
  const progressValue = Math.min(Math.max(value, 0), 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>

        {showPercentage && (
          <Text style={[styles.percentageText, { color }]}>
            {progressValue}%
          </Text>
        )}
      </View>

      <View style={[styles.progressBackground, { backgroundColor }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressValue}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#475569",
  },
  percentageText: {
    fontSize: 13,
    fontWeight: "700",
  },
  progressBackground: {
    height: 12,
    borderRadius: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 20,
  },
});
