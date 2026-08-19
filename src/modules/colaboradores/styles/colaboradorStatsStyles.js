/**
 * ESTILOS: colaboradorStatsStyles
 * Agrupa las hojas de estilo del componente ColaboradorStats,
 * usado para mostrar estadísticas de actividad.
 *
 * @dependencies - COLORS de theme/colors.js, TYPOGRAPHY de theme/typography.js
 * @validations  - N/A
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  // ── Tarjeta de estadísticas ─────────────────────────────────
  card: {
    marginBottom: 16,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  // ── Fila de indicadores ─────────────────────────────────────
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 4,
  },

  // ── Última actividad ──────────────────────────────────────
  lastActive: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginTop: 8,
  },
});