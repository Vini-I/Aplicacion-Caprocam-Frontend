/**
 * ESTILOS: colaboradorCardStyles
 * Agrupa las hojas de estilo del componente ColaboradorCard,
 * utilizado en listas y pantallas de colaboradores.
 *
 * @dependencies - COLORS de theme/colors.js
 * @validations  - N/A
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  // ── Tarjeta individual ──────────────────────────────────────
  card: {
    marginBottom: 12,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  // ── Cabecera de la tarjeta ──────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  // ── Detalles del colaborador ──────────────────────────────
  details: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
    iconSpacing: {
    marginRight: 6,
  },

  // ── Acciones (editar/eliminar) ─────────────────────────────
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionBtn: {
    marginTop: 0,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "transparent",
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
  },
});