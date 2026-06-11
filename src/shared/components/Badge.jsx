/**
 * ============================================================
 * COMPONENTE BADGE
 * ============================================================
 *
 * Etiqueta pequena reutilizable para estados, categorias o contadores.
 *
 * Funcionalidad:
 * - Muestra texto corto.
 * - Permite variantes visuales: info, success, warning y danger.
 * - Permite personalizar estilos del contenedor y del texto.
 *
 * Props principales:
 * - label: texto que se muestra dentro del badge.
 * - variant: estilo visual.
 * - style: estilos extra para el contenedor.
 * - textStyle: estilos extra para el texto.
 *
 * Ejemplo:
 * <Badge label="Activo" variant="success" />
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors"; 

export default function Badge({
  label = "",
  variant = "info",
  style,
  textStyle,
}) {
  const badgeStyles = [styles.badge];

  if (variant === "success") {
    badgeStyles.push(styles.success);
  }

  if (variant === "warning") {
    badgeStyles.push(styles.warning);
  }

  if (variant === "danger") {
    badgeStyles.push(styles.danger);
  }

  if (style) {
    badgeStyles.push(style);
  }

  return (
    <View style={badgeStyles}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  success: {
    backgroundColor: COLORS.successLight,
  },
  warning: {
    backgroundColor: COLORS.warningLight,
  },
  danger: {
    backgroundColor: COLORS.errorLight,
  },
  text: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 12,
  },
});
