/**
 * ============================================================
 * ESTILOS TrazabilidadFormStyles
 * ============================================================
 *
 * Descripción:
 * Estilos estandarizados para cards, labels y campos de error del formulario de trazabilidad.
 *
 * @dependencies StyleSheet, COLORS, TYPOGRAPHY
 * @validations N/A
 * @navigation N/A
 */
import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  cardTitle: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 16,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  label: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 6,
    fontSize: 14,
  },
  field: {
    marginBottom: 16,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  plNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});