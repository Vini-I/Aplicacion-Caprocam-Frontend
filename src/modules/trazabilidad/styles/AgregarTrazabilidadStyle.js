/**
 * ============================================================
 * ESTILOS AgregarTrazabilidadStyle
 * ============================================================
 *
 * Descripción:
 * Estilos centralizados para la pantalla AgregarTrazabilidadScreen.
 *
 * @dependencies StyleSheet, COLORS, TYPOGRAPHY
 * @validations N/A
 * @navigation N/A
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 100,
  },

  infoBanner: {
    marginBottom: 16,
    alignItems: "center",
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },

  floatingButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    alignItems: "center",
  },

  fullButton: {
    width: "100%",
    maxWidth: 900,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    paddingHorizontal: 16,
    paddingVertical: 0,
    alignSelf: "center",
  },

  btnContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  btnText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.primary,
  },

  alertBox: {
    marginBottom: 16,
    alignItems: "center",
  },
  alertText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  infoAlertText: {
    color: COLORS.white,
    textAlign: "center",
  },
  errorAlertText: {
    color: COLORS.error,
    textAlign: "center",
  },
});