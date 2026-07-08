/**
 * ============================================================
 * ESTILOS: mantEquipoStyles
 * ============================================================
 * 
 * Responsabilidad: Agrupa las hojas de estilo del módulo de
 * Mantenimiento de Equipos, garantizando la consistencia visual,
 * márgenes consistentes y adaptabilidad en pantallas pequeñas.
 * 
 * Datos:
 * - Define reglas de layout, tabla, modales, botones y selectores.
 * 
 * Validaciones:
 * - Opciones de combobox alineadas a la izquierda.
 * - Tabla flexible y adaptable a 100% de ancho sin forzar scroll.
 * - Botones con diseño de borde (outline) de acuerdo a estándares.
 * 
 * Navegación:
 * - Ninguna.
 * 
 * Dependencias:
 * - COLORS de theme/colors.js.
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  // ── Pantalla ───────────────────────────────────────────────
  screen:  { flex: 1, backgroundColor: COLORS.surface },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, maxWidth: 960, width: "100%", alignSelf: "center" },

  // ── Encabezado Interno (Body) ──────────────────────────────
  headerRow:  { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16, marginTop: 4 },
  screenTitle: { fontSize: 22, fontWeight: "700", color: COLORS.textSecondary },
  backButton:  { height: 40, width: 40, paddingVertical: 0, paddingHorizontal: 0, marginTop: 0, justifyContent: "center", alignItems: "center", borderRadius: 8, borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.white },

  // ── Toolbar ────────────────────────────────────────────────
  toolbar:     { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap", zIndex: 100, overflow: "visible" },
  searchBox:   { flex: 1, minWidth: 180, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, backgroundColor: COLORS.white, paddingHorizontal: 10, height: 42, gap: 6 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  btnAddTask:    { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: COLORS.warning, backgroundColor: COLORS.white, gap: 6 },
  btnVerEquipos: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: COLORS.warning, backgroundColor: COLORS.white, gap: 6 },
  btnAddMaint:   { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.white, gap: 6 },
  btnLabel:    { fontWeight: "700", fontSize: 13 },

  // ── Filtro select (wrapper para dropdown flotante) ─────────
  filtroWrapper:   { minWidth: 160, zIndex: 100, position: "relative" },
  filtroBtn:       { height: 42, borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, backgroundColor: COLORS.white, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 },
  filtroBtnText:   { fontSize: 14, color: COLORS.textSecondary, flex: 1 },
  filtroArrow:     { fontSize: 14, color: COLORS.textTertiary },
  filtroDropdown:  { position: "absolute", top: 46, left: 0, right: 0, borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, backgroundColor: COLORS.white, zIndex: 200, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 200 },
  filtroOpcion:    { paddingVertical: 11, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: COLORS.secondary, alignItems: "flex-start", justifyContent: "flex-start", width: "100%" },
  filtroOpcionTxt: { fontSize: 14, color: COLORS.textSecondary, textAlign: "left", width: "100%" },
  
  // ── Tabla Estandarizada sin Scroll Horizontal ──────────────
  tableWrapper: { width: "100%", borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 10, overflow: "hidden", backgroundColor: COLORS.white },
  tableHeader:  { flexDirection: "row", backgroundColor: COLORS.secondary, paddingVertical: 10, paddingHorizontal: 12, gap: 12 },
  colTicket: { width: 72 },
  colDue:    { flex: 1, minWidth: 90 },
  colStatus: { flex: 1, minWidth: 110 },
  colTool:   { flex: 1.2, minWidth: 100 },
  colTareas: { flex: 2, minWidth: 140 },
  colDesc:   { flex: 2, minWidth: 140 },
  colBy:     { flex: 1, minWidth: 90 },
  headerCell:   { fontSize: 12, fontWeight: "700", color: COLORS.textSecondary },
  row:          { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: COLORS.secondary, gap: 12 },
  ticketLink:   { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  cellText:     { fontSize: 12, color: COLORS.textSecondary },
  cellTextSub:  { fontSize: 11, color: COLORS.textTertiary, marginTop: 1 },
  cellIdEmpleado: { fontSize: 10, color: COLORS.textTertiary, marginTop: 2 },

  // ── Badges ─────────────────────────────────────────────────
  badgeEnMant:    { backgroundColor: COLORS.secondary,  paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start" },
  badgeFuera:     { backgroundColor: COLORS.errorLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start" },
  badgeText:      { fontSize: 11, fontWeight: "700", color: COLORS.textSecondary },
  badgeTextFuera: { fontSize: 11, fontWeight: "700", color: COLORS.error },

  // ── Modales comunes ────────────────────────────────────────
  modalContainer:    { height: 620, maxHeight: "92%", maxWidth: 600, width: "100%" },
  modalTitle:        { fontSize: 18, fontWeight: "700", color: COLORS.textSecondary },
  modalScroll:       { flex: 1 },
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
  comboDropdown:     { borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, backgroundColor: COLORS.white, marginTop: 4 },
  comboOption:       { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: COLORS.secondary, alignItems: "flex-start", justifyContent: "flex-start", width: "100%" },
  comboOptionText:   { fontSize: 13, color: COLORS.textSecondary, textAlign: "left", width: "100%" },
  equipoDetailCard:  { backgroundColor: COLORS.surface, borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.secondary },
  equipoDetailRow:   { flexDirection: "row", marginBottom: 4, gap: 6 },
  equipoDetailLabel: { fontSize: 12, color: COLORS.textTertiary, width: 90 },
  equipoDetailVal:   { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary, flex: 1 },
});
