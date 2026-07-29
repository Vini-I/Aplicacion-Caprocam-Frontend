/**
 * ============================================================
 * STYLES: ENFERMEDADES
 * ============================================================
 *
 * Descripcion:
 * Estilos de EnfermedadesScreen.
 */

import {
  StyleSheet,
} from "react-native";

import {
  COLORS,
} from "../../../theme/colors";

import {
  TYPOGRAPHY,
} from "../../../theme/typography";

const BORDER_COLOR =
  COLORS.border ||
  COLORS.inputBorder ||
  "#E5E7EB";

const SURFACE_COLOR =
  COLORS.surface ||
  "#F8FAFC";

const PRIMARY_LIGHT =
  COLORS.primaryLight ||
  "#EAF6FF";

const ERROR_LIGHT =
  COLORS.errorLight ||
  "#FEECEC";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SURFACE_COLOR,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  content: {
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 28,
  },

  contentTablet: {
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 20,
  },

  contentDesktop: {
    maxWidth: 1100,
    paddingHorizontal: 24,
  },

  card: {
    width: "100%",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 14,
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
    columnGap: 14,
  },

  gridItem: {
    width: "100%",
  },

  gridItemTablet: {
    flexGrow: 1,
    flexBasis: "46%",
    minWidth: 240,
  },

  gridItemDesktop: {
    flexBasis: "31%",
    minWidth: 260,
  },

  gridItemFull: {
    width: "100%",
    flexBasis: "100%",
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    marginLeft: 8,
    textTransform: "uppercase",
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  label: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textPrimary,
  },

  disabledInput: {
    backgroundColor: SURFACE_COLOR,
    color: COLORS.textTertiary,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  alert: {
    width: "100%",
    marginBottom: 12,
  },

  alertText: {
    lineHeight: 18,
  },

  actions: {
    width: "100%",
    marginBottom: 12,
    gap: 10,
  },

  outlinePrimaryButton: {
    width: "100%",
    minHeight: 46,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },

  cancelEditButton: {
    width: "100%",
    minHeight: 44,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },

  inlineButtonContentCentered: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  savedHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  reloadButton: {
    minHeight: 32,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },

  emptyText: {
    paddingVertical: 12,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  savedCase: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: COLORS.white,
    padding: 12,
    marginTop: 10,
  },

  savedCaseHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },

  savedCaseHeaderText: {
    flex: 1,
    minWidth: 0,
  },

  savedCaseTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 2,
  },

  caseActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  caseActionButton: {
    minHeight: 32,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: PRIMARY_LIGHT,
  },

  deleteButton: {
    minHeight: 32,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: ERROR_LIGHT,
  },

  infoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },

  infoLabel: {
    width: 110,
    paddingRight: 8,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  infoValue: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});
