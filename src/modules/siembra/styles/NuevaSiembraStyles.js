import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomWidth: 0,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: "left",
    alignSelf: "flex-start",
    width: "100%",
  },
  scrollContent: {
    paddingVertical: 28,
    paddingBottom: 40,
  },
  wrapper: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 18,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  iconColor: {
    color: COLORS.white,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 20,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  modalTitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 8,
  },
  modalMessage: {
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});
