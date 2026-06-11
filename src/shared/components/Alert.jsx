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
    backgroundColor: "#e7f1ff",
    borderColor: "#9ec5fe",
  },
  success: {
    backgroundColor: "#d1e7dd",
    borderColor: "#a3cfbb",
  },
  warning: {
    backgroundColor: "#fff3cd",
    borderColor: "#ffda6a",
  },
  danger: {
    backgroundColor: "#f8d7da",
    borderColor: "#f1aeb5",
  },
  text: {
    color: "#212529",
    fontSize: 14,
    fontWeight: "500",
  },
});
