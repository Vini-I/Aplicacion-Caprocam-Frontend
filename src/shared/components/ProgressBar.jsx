/**
 * ============================================================
 * COMPONENTE PROGRESSBAR
 * ============================================================
 *
 * Barra de progreso reutilizable para React Native.
 *
 * Funcionalidad:
 * - Muestra avance de 0 a 100.
 * - Permite mostrar u ocultar porcentaje.
 * - Permite personalizar colores.
 *
 * Props principales:
 * - progress: numero de progreso entre 0 y 100.
 * - showLabel: muestra el porcentaje.
 * - color: color de la barra.
 * - backgroundColor: color del fondo.
 * - style: estilos extra.
 *
 * Ejemplo:
 * <ProgressBar progress={70} />
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

function normalizeProgress(progress) {
  let value = progress;

  if (value < 0) {
    value = 0;
  }

  if (value > 100) {
    value = 100;
  }

  return value;
}

export default function ProgressBar({
  progress = 0,
  showLabel = true,
  color = COLORS.primary,
  backgroundColor = COLORS.secondary,
  style,
}) {
  const normalizedProgress = normalizeProgress(progress);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.track, { backgroundColor: backgroundColor }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${normalizedProgress}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      {showLabel === true && (
        <Text style={styles.label}>{normalizedProgress}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  track: {
    width: "100%",
    height: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 10,
  },
  label: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: "right",
  },
});
