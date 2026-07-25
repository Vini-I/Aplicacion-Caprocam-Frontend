/**
 * ============================================================
 * COMPONENTE FILTERCHIP
 * ============================================================
 *
 * Responsabilidad:
 * - Chip reutilizable para filtros activos o seleccionables.
 * - Usa borde y relleno suave cuando esta activo.
 */

import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";

export default function FilterChip({
  label,
  active = false,
  onPress,
  style,
  textStyle,
}) {
  const chipStyles = [styles.chip];
  const labelStyles = [styles.label];

  if (active === true) {
    chipStyles.push(styles.activeChip);
    labelStyles.push(styles.activeLabel);
  }

  if (style) {
    chipStyles.push(style);
  }

  if (textStyle) {
    labelStyles.push(textStyle);
  }

  return (
    <Pressable style={chipStyles} onPress={onPress} accessibilityRole="button">
      <Text style={labelStyles}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.white,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  activeChip: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },

  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  activeLabel: {
    color: COLORS.primary,
  },
});
