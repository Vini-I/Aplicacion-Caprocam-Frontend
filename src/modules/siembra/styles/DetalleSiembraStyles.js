/**
 * ============================================================
 * ESTILOS DETALLE DE SIEMBRA
 * ============================================================
 *
 * Define los estilos utilizados en la pantalla de detalle
 * y edición de una siembra existente.
 *
 * Incluye:
 * - Resumen de la siembra.
 * - Indicadores de etapa.
 * - Acciones disponibles.
 * - Botones principales.
 */
import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  alert: {
    width: "100%",
    marginBottom: 16,
  },
  alertSuccess: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  resumenHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  headerIcon: {
    color: COLORS.white,
  },

  summaryIcon: {
    color: COLORS.white,
  },
  resumenInfo: {
    flex: 1,
  },
  siembraTitle: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textTertiary,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    marginBottom: 16,
  },
  etapas: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 16,
  },
  badgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  badgeEtapa: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
    flex: 1,
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  button: {
    flex: 1,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  textoBoton: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
});
