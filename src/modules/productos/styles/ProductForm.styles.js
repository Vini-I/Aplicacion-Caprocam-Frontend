import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";
import { TYPOGRAPHY } from "../../../theme/typography";


export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
    borderBottomColor: COLORS.primary,
  },

  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },

  backBtn: {
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },

  navbarPlaceholder: {
    width: 32,
    height: 32,
  },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: COLORS.white,
    borderColor: COLORS.header,
  },
  cardTitle: {
    fontSize: 19,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,   // ← anula cualquier peso interno del Card
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,   // ← agrega esto para anular el fontWeight interno
    color: COLORS.black,
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.header,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  numberInput: {
    borderRadius: 12,
    borderColor: COLORS.header,
    backgroundColor: COLORS.white,
  },
  select: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.header,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textQuaternary || "#D1D5DB",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.white,
  },
  validationText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});