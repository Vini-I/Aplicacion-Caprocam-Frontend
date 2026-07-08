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
    paddingHorizontal: 20,
    paddingTop: 28,
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

  headerRowLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 15,
  },

  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },

  iconColor: {
    color: COLORS.white,
    bold: true,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginBottom: 2,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  title: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    lineHeight: 22,
  },

  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 40,
  },

  wrapper: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  notFoundText: {
    textAlign: "center",
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: 40,
  },

  movimientoCard: {
    marginBottom: 4,
  },

  movimientoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  estanqueBox: {
    flex: 1,
    alignItems: "center",
  },

  estanqueLabel: {
    color: COLORS.textTertiary,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginBottom: 4,
    textAlign: "center",
  },

  estanqueValor: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: "center",
  },

  flechaTexto: {
    color: COLORS.primary,
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  fincaTexto: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    textAlign: "center",
    marginTop: 12,
  },

  cardTitle: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  inputLectura: {
    backgroundColor: COLORS.secondary,
  },

  labelLectura: {
    color: COLORS.textSecondary,
  },

  badgeHistorico: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
});
