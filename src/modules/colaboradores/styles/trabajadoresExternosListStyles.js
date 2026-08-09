/**
 * ESTILOS: trabajadoresExternosListStyles
 * Agrupa las hojas de estilo del componente TrabajadoresExternosList,
 * que muestra la lista de colaboradores externos asociados a un dueño.
 *
 * @dependencies - COLORS de theme/colors.js
 * @validations  - N/A
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  // ── Tarjeta contenedora ─────────────────────────────────────
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  // ── Elemento de la lista ────────────────────────────────────
  item: {
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingVertical: 12,
  },
    itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  iconSpacing: {
    marginRight: 6,
  },
  itemDetailText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  itemName: {
    fontWeight: "bold",
    color: COLORS.textSecondary,
    fontSize: 15,
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },

  // ── Estado vacío ────────────────────────────────────────────
  emptyText: {
    textAlign: "center",
    color: COLORS.textTertiary,
    paddingVertical: 16,
  },
});