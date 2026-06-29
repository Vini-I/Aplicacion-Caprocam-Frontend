import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  cardTitle: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  webDateContainer: {
    marginBottom: 12,
  },
  webDateLabel: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  webDateInput: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  calculationBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  calculationLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textTertiary,
    marginBottom: 4,
  },

  calculationValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
});
