import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomWidth: 0,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  title: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    lineHeight: 22,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },

  headerRowLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 15,
  },

  iconColor: {
    color: COLORS.white,
  },

  scrollContent: {
    paddingVertical: 28,
    paddingBottom: 40,
  },

  wrapper: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  infoBanner: {
    marginBottom: 16,
    color: COLORS.white,

  },

  createButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  createButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  createButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: "700",
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
