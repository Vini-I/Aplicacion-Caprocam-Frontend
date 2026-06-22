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
});
