import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  screen: {
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

  title: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    lineHeight: 22,
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
  newButton: {
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

  newButtonText: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    lineHeight: 24,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  wrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  busquedaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 8,
  },

  searchBarContainer: {
    flex: 1,
  },

  filterButton: {
    height: 43,
    marginTop: 0,
  },

  contadorResultados: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  lista: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  tarjeta: {
    width: "100%",
  },

  vacioContainer: {
    paddingVertical: 24,
  },

  vacioTitulo: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  vacioTexto: {
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    textAlign: "center",
  },

  vacioIcono: {
    color: COLORS.primary,
    opacity: 0.5,
    marginTop: 12,
  },
  iconColor: {
    color: COLORS.white,
    bold: true,
  },
});
