import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  touchable: {
    width: "100%",
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
    marginTop: 0,
    borderRadius: 0,
    alignItems: "stretch",
  },

  card: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  fincaText: {
    flex: 1,
    marginRight: 8,
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  fechaText: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  colaboradorText: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginBottom: 14,
  },

  movimiento: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 3,
    marginBottom: 16,
  },

  estanqueText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    flexShrink: 1,
  },

  flechaIcon: {
    marginHorizontal: 28,
    transform: [{ scaleX: 1.6 }],
    alignSelf: "center",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingTop: 12,
  },

  dato: {
    alignItems: "flex-start",
  },

  datoLabel: {
    color: COLORS.textTertiary,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginBottom: 2,
  },

  datoValor: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});
