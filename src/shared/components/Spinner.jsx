/**
 * ============================================================
 * COMPONENTE SPINNER
 * ============================================================
 *
 * Indicador de carga reutilizable para React Native.
 *
 * Funcionalidad:
 * - Muestra un ActivityIndicator centrado.
 * - Permite cambiar tamano, color y texto opcional.
 *
 * Props principales:
 * - size: tamano del indicador.
 * - color: color del indicador.
 * - text: mensaje opcional debajo del indicador.
 * - style: estilos extra para el contenedor.
 *
 * Ejemplo:
 * <Spinner text="Cargando datos" />
 */

import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors"; 

export default function Spinner({
  size = "large",
  color = COLORS.primary,
  text = "",
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />

      {text !== "" && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textTertiary,
  },
});