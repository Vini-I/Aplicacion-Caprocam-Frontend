/**
 * ============================================================
 * ESTILOS DEL MODULO PARASITOLOGIA
 * ============================================================
 *
 * Contiene solamente los estilos propios del formulario.
 * Los estilos generales provienen de theme/style.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
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

  campoConError: {
    borderColor: COLORS.error,
  },

  previewCard: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  previewTitle: {
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  previewBox: {
    flexGrow: 1,
    minWidth: "30%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },

  previewLabel: {
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  previewValue: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  gradeBox: {
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.secondary,
  },

  gradeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.white,
  },

  gradeDescription: {
    marginTop: 8,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  outlinePrimaryButton: {
    minHeight: 50,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
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
});