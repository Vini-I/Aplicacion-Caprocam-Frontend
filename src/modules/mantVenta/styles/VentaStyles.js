/**
 * ============================================================
 * ESTILOS DEL MÓDULO DE VENTAS
 * ============================================================
 *
 * Centraliza los estilos visuales utilizados por las pantallas
 * y componentes del módulo de ventas.
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";
import { TYPOGRAPHY } from "../../../theme/typography.js";

export const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  headerIcon: {
    marginRight: 8,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 10,
  },

  sectionIcon: {
    marginRight: 8,
  },

  sectionText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  inputGrid: {
    gap: 0,
  },

  inputRow: {
    flexDirection: "row",
    gap: 12,
  },

  inputItem: {
    flex: 1,
  },

  summaryBox: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    marginTop: 4,
    marginBottom: 12,
  },

  summaryLabel: {
    color: COLORS.textTertiary,
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  currencyPreview: {
    color: COLORS.textTertiary,
    marginTop: -4,
    marginBottom: 12,
  },

  alert: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  alertText: {
    textAlign: "center",
    color: COLORS.black,
  },

  successAlert: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    marginBottom: 14,
     maxWidth: 900,
    alignSelf: "center",
    width: "100%",
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },

  successAlertText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontWeight: "600",
  },


  buttonRow: {
    marginTop: 12,
  },

  successText: {
    color: COLORS.success,
    marginBottom: 12,
  },

  saveButton: {
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  buttonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 16,
  },

  errorText: {
    color: COLORS.error,
    marginTop: 12,
  },

  detalleSection: {
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },

  detalleHint: {
    color: COLORS.textTertiary,
    fontSize: 13,
    textAlign: "left",
    marginBottom: 8,
    width: "100%",
    maxWidth: 700,
  },

  lista: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  tarjeta: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    marginTop: 10,
  },

  tarjetaEncabezado: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  nombreProducto: {
    flex: 1,
    marginRight: 8,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  filasDetalle: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  filaDetalle: {
    width: "45%",
    minWidth: 140,
    gap: 2,
  },

  etiquetaDetalle: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  valorDetalle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  emptyState: {
    width: "100%",
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },

  emptyTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  emptyDescription: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: "center",
  },

  buttonsCrud: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  delete: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.error,
    borderWidth: 2,
    marginBottom: "auto",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 2,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },

    deleteIcon: {
    color: COLORS.error,
  },

    edit: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 2,
    marginBottom: "auto",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  
  editIcon: {
    color: COLORS.primary,
  },

});
