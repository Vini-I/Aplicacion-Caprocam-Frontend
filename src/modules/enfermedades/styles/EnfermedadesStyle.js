/**
 * ============================================================
 * ESTILOS DEL MODULO ENFERMEDADES
 * ============================================================
 *
 * Estilos para el formulario de registro de enfermedades
 * y los detalles guardados.
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


  gridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 14,
  },

  gridItem: {
    width: "100%",
  },


  gridItemDesktop: {
    width: "32%",
  },

  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  optionButton: {
    minWidth: "30%",
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 0,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
  },

  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
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

  savedCaseTitle: {
    marginBottom: 10,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
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
});
