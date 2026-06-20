/**
 * ============================================================
 * ESTILOS DEL MODULO ESTANQUES
 * ============================================================
 *
 * Centraliza los estilos usados por las pantallas:
 * - NuevoEstanqueScreen.jsx
 * - EditarEstanqueScreen.jsx
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  screen: { flex: 1, width: "100%", backgroundColor: COLORS.surface },

  header: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerDesktop: { paddingHorizontal: 48 },

  cancelButton: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
    marginBottom: 20,
  },

  cancelText: { marginLeft: 8, fontFamily: TYPOGRAPHY.fontFamily.medium },

  inlineButtonContent: { flexDirection: "row", alignItems: "center" },

  inlineButtonContentCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
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

  actions: {
    marginBottom: 32,
  },

  actionsTablet: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  actionButton: {
    minWidth: 180,
    borderRadius: 14,
  },

  saveButton: {
    minHeight: 50,
    borderRadius: 14,
    marginBottom: 32,
  },

  saveText: {
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});
