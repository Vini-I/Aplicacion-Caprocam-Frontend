/**
 * ============================================================
 * COMPONENTE BUTTON
 * ============================================================
 *
 * Boton reutilizable para React Native.
 *
 * Funcionalidad:
 * - Usa Pressable para manejar la accion del usuario.
 * - Recibe children para permitir texto, iconos u otros elementos.
 * - Permite variantes visuales: primary, secondary, danger y outline.
 * - Permite estado disabled para bloquear la accion.
 *
 * Props principales:
 * - children: contenido visible dentro del boton.
 * - onPress: funcion que se ejecuta al presionar.
 * - variant: estilo visual del boton.
 * - disabled: desactiva el boton.
 * - style: estilos extra para el contenedor.
 * - textStyle: estilos extra para el texto cuando children es texto.
 *
 * Ejemplo:
 * <Button onPress={guardarDatos}>Guardar</Button>
 */

import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

export default function Button({
  children,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
}) {
  const buttonStyles = [styles.button];
  const textStyles = [styles.text];

  if (variant === "secondary") {
    buttonStyles.push(styles.secondary);
  }

  if (variant === "danger") {
    buttonStyles.push(styles.danger);
  }

  if (variant === "outline") {
    buttonStyles.push(styles.outline);
    textStyles.push(styles.outlineText);
  }

  if (disabled === true) {
    buttonStyles.push(styles.disabled);
  }

  if (style) {
    buttonStyles.push(style);
  }

  if (textStyle) {
    textStyles.push(textStyle);
  }

  let content = children;

  if (typeof children === "string") {
    content = <Text style={textStyles}>{children}</Text>;
  }

  if (typeof children === "number") {
    content = <Text style={textStyles}>{children}</Text>;
  }

  return (
    <Pressable
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0d6efd",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  secondary: {
    backgroundColor: "#6c757d",
  },
  danger: {
    backgroundColor: "#dc3545",
  },
  outline: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#0d6efd",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineText: {
    color: "#0d6efd",
  },
});
