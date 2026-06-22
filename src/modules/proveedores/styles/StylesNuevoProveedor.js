import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const ICON_SIZES = {
  back: 27,
  save: 20,
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface
  },
  navbar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  navbarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    flex: 1,
  },
  backBtn: {
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  navbarPlaceholder: {
    width: 32, height: 32
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16, paddingBottom: 32
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
    marginBottom: 14
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
    borderRadius: 12,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  select: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },
  selectOption: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  selectText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "700",
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  alertBox: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  alertText: {
    textAlign: "center",
    width: "100%",
  },
});