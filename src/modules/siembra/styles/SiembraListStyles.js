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
    paddingBottom: 90,
  },
  contentHeader: {
    paddingTop: 18,
    paddingBottom: 8,
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
  newButtonContent: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
},
  newButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: "center",
    flexShrink: 0,
  },
  searchBarContainer: {
    flex: 1,
    minHeight: 44,
  },
  barraBusqueda: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 12,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  addButton: {
    width: "100%",
    maxWidth: 900,
    marginTop: 0,
    borderRadius: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  contadorResultados: {
    marginBottom: 12,
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  card: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.surface,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  cardSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  cardSubtitle: {
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  infoRowLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
});
