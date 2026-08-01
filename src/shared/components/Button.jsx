/**
 * ============================================================
 * COMPONENTE BUTTON
 * ============================================================
 *
 * Responsabilidad:
 * - Centraliza botones de la aplicacion.
 * - Usa outline como variante por defecto.
 * - Mantiene variantes con relleno solo cuando el modulo lo solicite.
 * - Permite texto, iconos o contenido personalizado como children.
 */

import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";

function addVariantStyles(variant, buttonStyles, textStyles) {
  if (variant === "primary") {
    buttonStyles.push(styles.primary);
    textStyles.push(styles.primaryText);
  }

  if (variant === "secondary") {
    buttonStyles.push(styles.secondary);
    textStyles.push(styles.secondaryText);
  }

  if (variant === "danger") {
    buttonStyles.push(styles.danger);
    textStyles.push(styles.dangerText);
  }

  if (variant === "ghost") {
    buttonStyles.push(styles.ghost);
    textStyles.push(styles.ghostText);
  }

  if (variant === "outline") {
    buttonStyles.push(styles.outline);
    textStyles.push(styles.outlineText);
  }
}

export default function Button({
  children,
  onPress,
  variant = "outline",
  disabled = false,
  style,
  textStyle,
}) {
  const buttonStyles = [styles.button];
  const textStyles = [styles.text];

  addVariantStyles(variant, buttonStyles, textStyles);

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
      style={function ({ pressed }) {
        const finalStyles = [...buttonStyles];

        if (pressed === true && disabled === false) {
          finalStyles.push(styles.pressed);
        }

        return finalStyles;
      }}
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
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderWidth: 1,
  },

  outline: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
  },

  primary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  secondary: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.textTertiary,
  },

  danger: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.error,
  },

  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },

  disabled: {
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.75,
  },

  text: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  outlineText: {
    color: COLORS.primary,
  },

  primaryText: {
    color: COLORS.white,
  },

  secondaryText: {
    color: COLORS.textTertiary,
  },

  dangerText: {
    color: COLORS.error,
  },

  ghostText: {
    color: COLORS.primary,
  },
});
