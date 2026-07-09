/**
 * ============================================================
 * COMPONENTE ALERT
 * ============================================================
 *
 * Alerta reutilizable para mostrar mensajes dentro de la app.
 *
 * Funcionalidad:
 * - Muestra un mensaje o children.
 * - Permite variantes visuales: info, success, warning y danger.
 * - Permite personalizar estilos del contenedor y del texto.
 *
 * Props principales:
 * - message: texto visible de la alerta.
 * - children: contenido alternativo al mensaje.
 * - variant: tipo visual de alerta.
 * - style: estilos extra para el contenedor.
 * - textStyle: estilos extra para el texto.
 *
 * Ejemplo:
 * <Alert variant="success" message="Guardado correctamente" />
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export default function Alert({
  message = "",
  children,
  variant = "info",
  style,
  textStyle,
}) {
  const alertStyles = [styles.alert];

  if (variant === "success") {
    alertStyles.push(styles.success);
  }

  if (variant === "warning") {
    alertStyles.push(styles.warning);
  }

  if (variant === "danger") {
    alertStyles.push(styles.danger);
  }

  if (style) {
    alertStyles.push(style);
  }

  let content = message;

  if (children) {
    content = children;
  }

  return (
    <View style={alertStyles}>
      <Text style={[styles.text, textStyle]}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.secondary,
  },
  success: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  warning: {
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
  },
  danger: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center"
  },
});
