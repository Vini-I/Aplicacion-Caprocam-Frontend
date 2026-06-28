import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";
import { TYPOGRAPHY } from "../../../theme/typography.js";

const { width } = Dimensions.get("window");
const isLargeScreen = width >= 700;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },

  contentWrapper: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  headerIcon: {
    marginRight: 8,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 10,
  },

  sectionIcon: {
    marginRight: 8,
  },

  sectionText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  inputGrid: {
    gap: 0,
  },

  inputRow: {
    flexDirection: "row",
    gap: 12,
  },

  inputItem: {
    flex: 1,
  },

  summaryBox: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    marginTop: 4,
    marginBottom: 12,
  },

  summaryLabel: {
    color: COLORS.textTertiary,
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  successText: {
    color: COLORS.success,
    marginBottom: 12,
  },

  currencyPreview: {
    color: COLORS.textTertiary,
    marginTop: -4,
    marginBottom: 12,
  },

  alert: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  alertText: {
    textAlign: "center",
    color: COLORS.error,
  },

  buttonRow: {
    marginTop: 12,
  },

  saveButton: {
    width: "100%",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },

  errorText: {
    color: COLORS.error,
    marginTop: 12,
  },
});
