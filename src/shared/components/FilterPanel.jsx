/**
 * ============================================================
 * COMPONENTE FILTERPANEL
 * ============================================================
 *
 * Responsabilidad:
 * - Contenedor compartido para filtros.
 * - Permite usar chips, fechas, selectores o acciones de filtro.
 * - Mantiene espaciado y borde uniforme.
 */

import React from "react";
import { StyleSheet, View } from "react-native";

import Button from "./Button";
import CustomText from "./Text";
import { COLORS } from "../../theme/colors";
import { TYPOGRAPHY } from "../../theme/typography";

export default function FilterPanel({ title = "Filtros", children, style }) {
  return (
    <View style={[styles.panel, style]}>
      {title !== "" && (
        <CustomText size={14} color={COLORS.textSecondary} style={styles.title}>
          {title}
        </CustomText>
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

export function FilterActions({ onClear, onApply }) {
  return (
    <View style={styles.actionsRow}>
      <Button variant="secondary" onPress={onClear} style={styles.actionButton}>
        Limpiar
      </Button>

      <Button variant="outline" onPress={onApply} style={styles.actionButton}>
        Aplicar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    padding: 14,
    marginBottom: 12,
  },

  title: {
    marginBottom: 10,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  content: {
    gap: 10,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
  },

  actionButton: {
    marginTop: 0,
    minHeight: 40,
  },
});
