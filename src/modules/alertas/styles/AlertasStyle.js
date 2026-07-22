/**
 * ============================================================
 * ESTILOS MODULO ALERTAS
 * ============================================================
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  summaryCard: {
    marginBottom: 14,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },

  summaryItem: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border || COLORS.secondary,
  },

  summaryValue: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  summaryLabel: {
    marginTop: 4,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  dropdownCard: {
    marginBottom: 12,
    padding: 0,
    overflow: "hidden",
  },

  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  dropdownIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  dropdownHeaderText: {
    flex: 1,
  },

  dropdownTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  dropdownSubtitle: {
    marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  counterBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    marginRight: 6,
  },

  alertList: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },

  categoryTitle: {
    marginTop: 8,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  alertItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },

  alertCritical: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
  },

  alertWarning: {
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
  },

  alertInfo: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },

  alertIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  alertContent: {
    flex: 1,
    minWidth: 0,
  },

  alertTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  alertTitle: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  dismissButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    marginLeft: 8,
  },

  alertMessage: {
    marginTop: 4,
    lineHeight: 18,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  alertDetail: {
    marginTop: 4,
    lineHeight: 17,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  emptyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
});
