/**
 * ============================================================
 * ESTILOS DEL MODULO PARASITOLOGIA
 * ============================================================
 *
 * Estilos exclusivos para ParasitologiaScreen.
 *
 * Usa:
 * - COLORS desde theme/colors.
 * - TYPOGRAPHY desde theme/typography.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.surface,
  },

  header: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerDesktop: {
    paddingHorizontal: 48,
  },

  cancelButton: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
    marginBottom: 20,
  },

  cancelText: {
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerTextBox: {
    flex: 1,
  },

  headerSubtitle: {
    marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  content: {
    paddingVertical: 18,
  },

  contentTablet: {
    paddingVertical: 18,
  },

  contentDesktop: {
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
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

  grid: {
    width: "100%",
  },

  gridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 12,
  },

  gridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 14,
  },

  gridItem: {
    width: "100%",
  },

  gridItemTablet: {
    width: "48.5%",
  },

  gridItemDesktop: {
    width: "32%",
  },

  gridItemFull: {
    width: "100%",
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

  saveButton: {
    minHeight: 50,
    borderRadius: 14,
    marginBottom: 18,
  },

  inlineButtonContent: {
    flexDirection: "row",
    alignItems: "center",
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

  emptyText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  savedCase: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  savedCaseHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  savedCaseTitleBox: {
    flex: 1,
    paddingRight: 10,
  },

  savedCaseTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  savedCaseSubtitle: {
    marginTop: 3,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  savedGradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },

  infoRow: {
    marginBottom: 8,
  },

  infoLabel: {
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  infoValue: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  outlinePrimaryButton: {
    minHeight: 50,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
});
