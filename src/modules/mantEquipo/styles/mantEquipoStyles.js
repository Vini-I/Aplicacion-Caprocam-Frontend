/**
 * ESTILOS: mantEquipoStyles
 * Ruta: src/modules/mantEquipo/styles/mantEquipoStyles.js
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  // ── Pantalla ───────────────────────────────────────────────
  screen:  { flex: 1, backgroundColor: COLORS.surface },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, maxWidth: 960, width: "100%", alignSelf: "center" },

  // ── Toolbar ────────────────────────────────────────────────
  toolbar:     { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  searchBox:   { flex: 1, minWidth: 180, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, backgroundColor: COLORS.white, paddingHorizontal: 10, height: 42, gap: 6 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  btnAddTask:  { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, height: 42, backgroundColor: COLORS.warning, gap: 6 },
  btnAddMaint: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, height: 42, backgroundColor: COLORS.primary, gap: 6 },
  btnLabel:    { color: COLORS.white, fontWeight: "700", fontSize: 13 },

  // ── Tabla ──────────────────────────────────────────────────
  tableWrapper: { borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 10, overflow: "hidden", backgroundColor: COLORS.white },
  tableHeader:  { flexDirection: "row", backgroundColor: COLORS.secondary, paddingVertical: 10, paddingHorizontal: 8 },
  colTicket: { width: 72 },
  colDue:    { flex: 1, minWidth: 100 },
  colStatus: { flex: 1, minWidth: 120 },
  colTool:   { flex: 1, minWidth: 110 },
  colDesc:   { flex: 2, minWidth: 140 },
  colBy:     { flex: 1, minWidth: 100 },
  headerCell:   { fontSize: 12, fontWeight: "700", color: COLORS.textSecondary },
  row:          { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: COLORS.secondary },
  ticketLink:   { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  cellText:     { fontSize: 12, color: COLORS.textSecondary },
  cellTextSub:  { fontSize: 11, color: COLORS.textTertiary, marginTop: 1 },

  // ── Badges ─────────────────────────────────────────────────
  badgeEnMant:    { backgroundColor: COLORS.secondary,  paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start" },
  badgeFuera:     { backgroundColor: COLORS.errorLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start" },
  badgeText:      { fontSize: 11, fontWeight: "700", color: COLORS.textSecondary },
  badgeTextFuera: { fontSize: 11, fontWeight: "700", color: COLORS.error },

  // ── Modales comunes ────────────────────────────────────────
  modalContainer:    { maxHeight: "92%", maxWidth: 600, width: "100%" },
  modalTitle:        { fontSize: 18, fontWeight: "700", color: COLORS.textSecondary },
  modalScroll:       { maxHeight: 480 },
  modalFooter:       { flexDirection: "row", gap: 10, marginTop: 16 },
  btnCancel:         { flex: 1 },
  btnAccept:         { flex: 1 },

  // ── Modal Detalle ──────────────────────────────────────────
  detalleEncabezado: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  detalleRow:        { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.secondary, gap: 6 },

  // ── Modal Agregar ──────────────────────────────────────────
  row2:              { flexDirection: "row", gap: 12, marginBottom: 4 },
  halfCol:           { flex: 1, minWidth: 120 },
  comboContainer:    { marginBottom: 12 },
  comboLabel:        { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary, marginBottom: 6 },
  comboInput:        { borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, color: COLORS.textSecondary, backgroundColor: COLORS.white },
  comboDropdown:     { borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, backgroundColor: COLORS.white, marginTop: 4, maxHeight: 150 },
  comboOption:       { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: COLORS.secondary },
  comboOptionText:   { fontSize: 13, color: COLORS.textSecondary },
  equipoDetailCard:  { backgroundColor: COLORS.surface, borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.secondary },
  equipoDetailRow:   { flexDirection: "row", marginBottom: 4, gap: 6 },
  equipoDetailLabel: { fontSize: 12, color: COLORS.textTertiary, width: 90 },
  equipoDetailVal:   { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary, flex: 1 },
});
