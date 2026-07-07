import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";


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
    borderColor: COLORS.secondary,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: undefined,   // ← anula cualquier peso interno del Card
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontWeight: undefined,   // ← agrega esto para anular el fontWeight interno
    color: COLORS.black,
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    fontSize: 15
  },
  numberInput: {
    borderRadius: 12,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  select: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.secondary,
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
    color: COLORS.white,
  },
  validationText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    color: COLORS.warning,
  },
});