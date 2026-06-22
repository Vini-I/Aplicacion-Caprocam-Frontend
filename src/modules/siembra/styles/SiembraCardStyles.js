import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  diasText: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  body: {
    marginBottom: 16,
  },

  estanqueText: {
    color: COLORS.textSecondary,
    fontSize: 30,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  estadoBadge: {
    backgroundColor: COLORS.success,
  },

  estadoText: {
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  fincaText: {
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginBottom: 10,
  },

  siembraText: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginBottom: 6,
  },

  cantidadText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },

  actionButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  actionButtonIcon: {
    color: COLORS.white,
  },
});
