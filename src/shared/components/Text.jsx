/**
 * ============================================================
 * COMPONENTE CUSTOMTEXT
 * ============================================================
 *
 * Texto reutilizable para React Native.
 *
 * Funcionalidad:
 * - Centraliza estilos de texto.
 * - Permite cambiar tamano, color, peso y alineacion.
 * - Permite limitar cantidad de lineas.
 *
 * Props principales:
 * - children: texto o contenido.
 * - size: tamano del texto.
 * - color: color del texto.
 * - weight: grosor del texto.
 * - align: alineacion.
 * - numberOfLines: cantidad maxima de lineas.
 * - style: estilos extra.
 *
 * Ejemplo:
 * <CustomText>Descripcion</CustomText>
 */

import React from "react";
import { Text, StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";

import { TYPOGRAPHY } from "../../theme/typography";

export default function CustomText({
  children,
  size = 14,
  color = COLORS.textPrimary,
  weight = "400",
  align = "left",
  numberOfLines,
  style,
  fuente = TYPOGRAPHY.fontFamily.regular
}) {
  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: size,
          color: color,
          fontWeight: weight,
          textAlign: align,
          
        },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
  },
});