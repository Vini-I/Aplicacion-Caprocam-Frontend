/**
 * ============================================================
 * TrazabilidadStyles.js
 * ============================================================
 *
 * Estilos del listado de Trazabilidad.
 *
 * Reglas importantes / restricciones:
 * - Mantener las claves mínimas necesarias; eliminar estilos huérfanos.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  footerContent: {
    width: "100%",
    paddingVertical: 12,
  },

  footerActions: {
    width: "100%",
  },

  fullButton: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
