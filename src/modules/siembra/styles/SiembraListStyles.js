/**
 * ============================================================
 * ESTILOS LISTADO DE SIEMBRAS
 * ============================================================
 *
 * Contiene los estilos visuales utilizados por la pantalla
 * de listado de siembras.
 *
 * Incluye:
 * - Encabezado de contenido.
 * - Tarjetas de siembra.
 * - Información resumida.
 * - Botones y estados visuales.
 *
 * Utiliza estilos globales de colores y tipografía.
 */
import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  contentHeader: {
    paddingTop: 22,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    flex: 1,
  },
  newButton: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 0,
  },
  newButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  newButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  card: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  cardSubtitle: {
    marginTop: 2,
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  statusBadge: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  statusText: {
    color: COLORS.success,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  cardBody: {
    gap: 8,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  infoLabel: {
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  infoValue: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: "right",
  },
  detailButton: {
    borderRadius: 14,
    paddingVertical: 11,
    marginTop: 0,
  },
  detailButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  detailButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});
