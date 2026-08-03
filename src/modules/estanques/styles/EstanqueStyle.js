/**
 * ============================================================
 * ESTILOS MODULO ESTANQUES
 * ============================================================
 *
 * Responsabilidad:
 * - Define estilos de NuevoEstanque, EditarEstanque y DetalleEstanque.
 * - Mantiene uso de COLORS y TYPOGRAPHY del theme.
 * - Incluye botones outline segun estandar.
 * - Incluye estilos para aireadores, acciones y modal de eliminar.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  alert: {
    marginBottom: 16,
  },

  alertText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    marginLeft: 8,
    textTransform: "uppercase",
  },

  label: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  labelText: {
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  twoColumns: {
    flexDirection: "row",
    gap: 12,
  },

  column: {
    flex: 1,
  },

  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },

  optionButton: {
    flexGrow: 1,
    minWidth: "30%",
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginTop: 0,
  },

  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
  },

  aeratorBox: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  helperText: {
    marginTop: 4,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  inlineButtonContentCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  outlinePrimaryButton: {
    minHeight: 50,
    borderRadius: 14,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },

  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  detailTitleBox: {
    flex: 1,
  },

  detailSubtitle: {
    marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  statusBox: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  statusText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  infoRow: {
    marginBottom: 10,
  },

  infoLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    marginTop: 4,
  },

  infoValue: {
    marginTop: 6,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  metricBox: {
    flexGrow: 1,
    minWidth: "45%",
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
  },

  metricLabel: {
    marginBottom: 5,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  metricValue: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  detailActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 32,
  },

  outlineDangerButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.white,
    marginTop: 0,
  },

  outlineEditButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    marginTop: 0,
  },

  outlineActionText: {
    marginLeft: 6,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  confirmBox: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },

  confirmIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.errorLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  confirmTitle: {
    marginBottom: 8,
    textAlign: "center",
  },

  confirmMessage: {
    lineHeight: 20,
    marginBottom: 18,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  confirmActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },

  confirmNoButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.textQuaternary,
    backgroundColor: COLORS.white,
    marginTop: 0,
  },

  confirmYesButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.white,
    marginTop: 0,
  },

  confirmButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  
});