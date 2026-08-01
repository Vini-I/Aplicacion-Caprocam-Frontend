/**
 * ============================================================
 * ESTILOS FisicoQuimicaStyles
 * ============================================================
 *
 * Descripción:
 * Estilos centralizados para la pantalla FisicoQuimicaScreen y sus componentes.
 *
 * @dependencies StyleSheet, COLORS, TYPOGRAPHY
 * @validations N/A
 * @navigation N/A
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.white
  },

  scrollContent: {
    width: "100%",
    maxWidth: 900,
    paddingTop: 16,
    paddingBottom: 100,
    alignSelf: "center",
    gap: 12,
  },

  formCard: {
  marginBottom: 20,
},



  label: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 6,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  estanqueInfo: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textTertiary,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.primary,
  },

  footerContent: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
  },
  footerActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
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
    gap: 8,
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
  alertWrapper: { width: "100%", alignSelf: "stretch" },
  alertBox: { width: "100%", alignSelf: "stretch", marginBottom: 8 },
  alertText: { textAlign: "center", fontWeight: "bold" },
  errorBanner: { marginTop: 12, width: "100%" },
  errorText: { textAlign: "center", fontFamily: TYPOGRAPHY.fontFamily.bold },
  spacer: { height: 24 },
});

