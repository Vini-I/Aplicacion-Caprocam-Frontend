/**
 * ============================================================
 * ESTILOS TrazabilidadStyles
 * ============================================================
 *
 * Descripción:
 * Estilos del listado principal de trazabilidad (tarjetas, badges y layout).
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
    paddingBottom: 24,
  },

  busquedaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 0,
    gap: 8,
    width: "100%",
  },

  filterButton: {
    height: 46,
    marginTop: 0,
    marginBottom: 0,
  },

  contadorResultados: {
    marginHorizontal: 0,
    marginTop: 14,
    marginBottom: 4,
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  lista: {
    paddingTop: 8,
    paddingHorizontal: 0,
    paddingBottom: 24,
  },

  tarjeta: {
    width: "100%",
  },

  touchable: {
    width: "100%",
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    marginTop: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "transparent",
  },

  card: {
    width: "100%",
    alignSelf: "center",
    marginBottom: 12,
  },

  cardHeader: {
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
    justifyContent: "space-around",
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

  cardFooter: {
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

  vacioContainer: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },

  searchBarContainer: {
    flex: 1,
    marginBottom: 0,
    height: 46,
    alignSelf: "center",
    borderColor: COLORS.black,
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

  successAlert: {
    marginTop: 8,
    marginBottom: 12,
  },

  errorAlertButton: {
    marginBottom: 12,
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

  errorAlertButton: {
    marginBottom: 12,
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
});
