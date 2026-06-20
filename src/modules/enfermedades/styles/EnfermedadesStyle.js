/**
 * ============================================================
 * ESTILOS DEL MODULO ENFERMEDADES
 * ============================================================
 *
 * Centraliza los estilos usados por:
 * - EnfermedadesScreen.jsx
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
    padding: 18,
  },

  contentTablet: {
    paddingHorizontal: 28,
  },

  contentDesktop: {
    maxWidth: 1100,
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

  boldText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
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

  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  riskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  riskTextBox: {
    marginLeft: 12,
    flex: 1,
  },

  badge: {
    marginTop: 6,
  },

  actions: {
    marginBottom: 32,
  },

  actionsTablet: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  actionButton: {
    minWidth: 190,
    borderRadius: 14,
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

  outlineButtonText: {
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  modalOverlay: {
    padding: 20,
  },

  modalContainer: {
    borderRadius: 18,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  modalTitle: {
    marginLeft: 10,
  },

  modalText: {
    lineHeight: 22,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});
