/**
 * ============================================================
 * ESTILOS DetalleTrazabilidadStyles
 * ============================================================
 *
 * Descripción:
 * Estilos centralizados para la pantalla de detalle de trazabilidad.
 *
 * @dependencies StyleSheet, COLORS, TYPOGRAPHY
 * @validations N/A
 * @navigation N/A
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },


  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 40,
  },

  notFoundText: {
    textAlign: "center",
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: 40,
  },

  movimientoCard: {
    marginBottom: 4,
  },

  movimientoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  estanqueBox: {
    flex: 1,
    alignItems: "center",
  },

  estanqueLabel: {
    color: COLORS.textTertiary,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginBottom: 4,
    textAlign: "center",
  },

  estanqueValor: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: "center",
  },

  flechaTexto: {
    color: COLORS.primary,
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  fincaTexto: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    textAlign: "center",
    marginTop: 12,
  },

  cardTitle: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  inputLectura: {
    backgroundColor: COLORS.secondary,
    dropShadow: "none",
  },

  labelLectura: {
    color: COLORS.textSecondary,
  },

  badgeHistorico: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
});
