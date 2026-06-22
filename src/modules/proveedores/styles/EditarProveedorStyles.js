/**
 * Estilos para la pantalla de edición de proveedor
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },

  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "left",
    marginTop: 5,
  },

  navbarPlaceholder: {
    width: 32,
    height: 32,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
  },

  cardTitle: {
    fontSize: 19,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.black,
    marginBottom: 6,
  },

  input: {
    minHeight: 48,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  inputDisabled: {
    minHeight: 48,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },

  select: {
    minHeight: 48,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },

  saveButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
  },

  saveButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.white,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.error,
  },

  alertContainer: {
    marginBottom: 16,
  },
});

export const ICON_STYLES = {
  exit: {
    size: 26,
    color: COLORS.white,
  },
  save: {
    size: 20,
    color: COLORS.white,
  },
};