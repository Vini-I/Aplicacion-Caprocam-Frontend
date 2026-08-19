/**
 * ============================================================
 * COMPONENTE TITLE
 * ============================================================
 *
 * Titulo reutilizable para React Native.
 *
 * Funcionalidad:
 * - Permite niveles de titulo del 1 al 6.
 * - Permite color, alineacion, texto apagado y subrayado.
 * - Permite truncar el texto con numberOfLines.
 *
 * Props principales:
 * - children: texto o contenido del titulo.
 * - level: nivel visual del titulo del 1 al 6.
 * - color: color personalizado.
 * - align: alineacion left, center o right.
 * - underline: muestra linea decorativa.
 * - muted: usa color gris.
 * - numberOfLines: cantidad maxima de lineas.
 *
 * Ejemplo:
 * <Title level={2} underline>Estanques</Title>
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "../../theme/colors";

import { TYPOGRAPHY } from "../../theme/typography";

function getScale(level) {
  const scale = {
    1: { fontSize: 32, fontFamily: TYPOGRAPHY.fontFamily.bold, lineHeight: 40 },
    2: { fontSize: 28, fontFamily: TYPOGRAPHY.fontFamily.bold, lineHeight: 36 },
    3: { fontSize: 24, fontFamily: TYPOGRAPHY.fontFamily.medium, lineHeight: 32 },
    4: { fontSize: 20, fontFamily: TYPOGRAPHY.fontFamily.medium, lineHeight: 28 },
    5: { fontSize: 16, fontFamily: TYPOGRAPHY.fontFamily.medium, lineHeight: 24 },
    6: { fontSize: 14, fontFamily: TYPOGRAPHY.fontFamily.medium, lineHeight: 20 },
  };

  let selectedScale = scale[1];

  if (scale[level]) {
    selectedScale = scale[level];
  }

  return selectedScale;
}

function getUnderlineAlign(align) {
  let underlineAlign = "flex-start";

  if (align === "center") {
    underlineAlign = "center";
  }

  if (align === "right") {
    underlineAlign = "flex-end";
  }

  return underlineAlign;
}

export default function Title({
  children,
  level = 1,
  color = COLORS.textPrimary,
  align = "left",
  underline = false,
  underlineColor = COLORS.primary,
  underlineWidth = 40,
  muted = false,
  numberOfLines,
  style,
  containerStyle,
  fuente
}) {
  let textColor = color;

  if (muted === true) {
    textColor = COLORS.textTertiary;
  }

  const fuenteFinal = fuente || getScale(level).fontFamily;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[getScale(level), { color: textColor, textAlign: align, fontFamily: fuenteFinal}, style]}
        numberOfLines={numberOfLines}
      >
        {children}
      </Text>

      {underline === true && (
        <View
          style={[
            styles.underlineWrapper,
            { justifyContent: getUnderlineAlign(align) },
          ]}
        >
          <View
            style={[
              styles.underlineLine,
              {
                width: underlineWidth,
                backgroundColor: underlineColor,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  underlineWrapper: {
    flexDirection: "row",
    marginTop: 6,
  },
  underlineLine: {
    height: 3,
    borderRadius: 2,
  },
});