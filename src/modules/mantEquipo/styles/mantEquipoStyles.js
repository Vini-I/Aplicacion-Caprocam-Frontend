/**
 * ESTILOS: mantEquipoStyles
 * Agrupa las hojas de estilo del módulo de Mantenimiento de Equipos,
 * garantizando consistencia visual, márgenes y adaptabilidad.
 *
 * @dependencies - COLORS de theme/colors.js
 * @validations  - Opciones de combobox alineadas a la izquierda.
 *               - Tabla flexible y adaptable al 100% de ancho.
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  // ── Toolbar ────────────────────────────────────────────────
  toolbar: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap", zIndex: 100, overflow: "visible" },
  btnAddTask: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: COLORS.warning, backgroundColor: COLORS.white, gap: 6, marginTop: 0 },
  btnAddMaint: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.white, gap: 6, marginTop: 0 },
  btnLabel: { fontWeight: "700", fontSize: 13 },

  // ── Tabla Estandarizada Responsiva ──────────────────────────
  tableWrapper: { width: "100%", borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 10, overflow: "hidden", backgroundColor: COLORS.white },
  tableContentInner: { width: "100%", minWidth: "100%" },
  tableHeader: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.secondary, paddingVertical: 12, paddingHorizontal: 16, width: "100%" },
  colTicket: { flex: 1, minWidth: 70, overflow: "hidden", paddingRight: 8 },
  colDue: { flex: 1, minWidth: 95, overflow: "hidden", paddingRight: 8 },
  colStatus: { flex: 1, minWidth: 135, alignItems: "flex-start", overflow: "hidden", paddingRight: 8 },
  colTitle: { flex: 1, minWidth: 100, overflow: "hidden", paddingRight: 8 },
  colDesc: { flex: 1, minWidth: 110, overflow: "hidden", paddingRight: 8 },
  colBy: { flex: 1, minWidth: 100, overflow: "hidden", paddingRight: 8 },
  colActions: { width: 110, alignItems: "center", justifyContent: "center" },
  colTitleMobile: { width: 130, overflow: "hidden", paddingRight: 8 },
  colDescMobile: { width: 175, overflow: "hidden", paddingRight: 12 },
  headerCell: { fontSize: 11, fontWeight: "700", color: COLORS.textSecondary },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: COLORS.secondary, width: "100%" },
  // ── CardPress-based row (reemplaza TouchableOpacity en TablaTicket) ──
  rowCard: { borderRadius: 0, borderWidth: 0, borderTopWidth: 1, borderTopColor: COLORS.secondary, marginBottom: 0, paddingVertical: 0, paddingHorizontal: 0, shadowOpacity: 0, elevation: 0 },
  rowInner: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, width: "100%" },
  ticketLink: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  cellText: { fontSize: 12, color: COLORS.textSecondary },
  cellTextSub: { fontSize: 11, color: COLORS.textTertiary, marginTop: 1 },

  // ── Badges de Estado ─────────────────────────────────────────
  badgeEnEspera: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeEnEsperaText: {
    color: COLORS.warning,
    fontSize: 11,
    fontWeight: "700",
  },
  badgeEnMantenimiento: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeEnMantenimientoText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  badgeTerminado: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeTerminadoText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: "700",
  },

  // ── Footer y Botones Comunes ────────────────────────────────

  formFooter: { flexDirection: "row", gap: 10, marginTop: 16 },
  btnAccept: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderColor: COLORS.primary },

  btnTextPrimary: { color: COLORS.primary, fontWeight: "600", fontSize: 13 },
  btnTextError: { color: COLORS.error, fontWeight: "600", fontSize: 13 },

  // ── Formularios Agregar / Editar ────────────────────────────

  halfCol: { flex: 1, minWidth: 120 },
  comboContainer: { marginBottom: 12 },
  comboLabel: { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary, marginBottom: 6 },
  comboInput: { borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, color: COLORS.textSecondary, backgroundColor: COLORS.white },

  equipoDetailCard: { backgroundColor: COLORS.surface, borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.secondary },
  equipoDetailHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  equipoDetailTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary },
  equipoDetailRow: { flexDirection: "row", marginBottom: 4, gap: 6, alignItems: "center" },
  equipoDetailRowTop: { flexDirection: "row", marginBottom: 4, gap: 6, alignItems: "center", borderTopWidth: 1, borderTopColor: COLORS.secondary, paddingTop: 6, marginTop: 4 },
  equipoDetailLabel: { fontSize: 12, color: COLORS.textTertiary, width: 160 },
  equipoDetailVal: { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary, flex: 1 },
  btnQuitarEquipo: { borderColor: COLORS.error, width: 90, height: 32, paddingVertical: 0, paddingHorizontal: 10, marginTop: 0, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 4 },
  btnQuitarEquipoText: { color: COLORS.error, fontSize: 11, fontWeight: "600" },

  btnActionOutline: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    backgroundColor: COLORS.white,
    marginTop: 0,
    width: "100%",
  },
  btnActionOutlineText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // ── Sección Título (icon + texto) ───────────────────────────
  sectionTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  sectionTitleIcon: { marginRight: 8 },
  sectionTitleText: { fontSize: 14, fontWeight: "700", color: COLORS.textSecondary, letterSpacing: 0.3 },

  // ── Layout de pantallas de formulario ───────────────────────
  screenFormContent: { paddingBottom: 40, gap: 16 },
  cardSection: { padding: 16 },

  // ── Campo solo lectura (Creado por) ─────────────────────────
  readOnlyField: { backgroundColor: COLORS.surface },
  readOnlyText: { fontSize: 14, color: COLORS.textSecondary },

  // ── Input multilinea (Descripción) ──────────────────────────
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },

  // ── Select con altura mínima ─────────────────────────────────
  selectMinHeight: { minHeight: 45 },

  // ── Preview de costo total ───────────────────────────────────
  costoTotalBox: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary, borderWidth: 1, borderRadius: 8, padding: 12, marginVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  costoTotalLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary },
  costoTotalValor: { fontSize: 16, fontWeight: "700", color: COLORS.primary },

  // ── Alerta de validación ─────────────────────────────────────
  alertValidacion: { marginVertical: 12, alignItems: "center", justifyContent: "center", width: "100%" },
  alertValidacionTexto: { color: COLORS.black, fontWeight: "600", fontSize: 13, textAlign: "center", width: "100%" },
  alertTopMargin: { marginTop: 12, alignItems: "center", justifyContent: "center", width: "100%" },
  alertSecondMargin: { marginTop: 8, alignItems: "center", justifyContent: "center", width: "100%" },

  // ── Pantalla Principal (ManteniminetoPrincipal) ──────────────
  screenRoot: { flex: 1, backgroundColor: COLORS.white },
  screenScrollContent: { flexGrow: 1, paddingBottom: 24 },
  toolbarWithZIndex: { zIndex: 10, marginTop: 12 },
  alertBottom: { marginBottom: 14 },
  emptyState: { padding: 24, alignItems: "center" },
  emptyStateText: { color: COLORS.textTertiary, fontSize: 14 },
  bottomButtonsRow: { flexDirection: "row", width: "100%", gap: 12, marginTop: 16 },
  floatingFooter: { paddingHorizontal: 16, paddingBottom: 28, paddingTop: 8 },
  btnFooterFlex: { flex: 1 },
  btnLabel: { marginLeft: 6, fontSize: 14, fontWeight: "600" },
  btnLabelPrimary: { color: COLORS.primary },
  btnLabelWarning: { color: COLORS.warning },
  btnLabelWhite: { color: COLORS.white },

  // ── FilterPanel inline (mantEquipo) ─────────────────────────
  filterButtonSpacing: { height: 42, marginTop: 0, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12 },
  filterGroupLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary, marginBottom: 6, marginTop: 4 },
  filterChipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  // Botón del FilterButton de shared (igual que inventario filterButton)
  filterBtn: { height: 42, marginTop: 0, alignItems: "center", justifyContent: "center", flexShrink: 0 },

  // ── Spinner centrado ─────────────────────────────────────────
  spinnerContainer: { justifyContent: "center", alignItems: "center" },

  // ── Detalles costos (DetalleMantenimiento) ───────────────────
  costoTotalRow: { borderTopWidth: 1, borderTopColor: COLORS.secondary, paddingTop: 6, marginTop: 4 },
  costoTotalRowLabel: { fontWeight: "700", color: COLORS.primary },
  costoTotalRowValor: { fontWeight: "700", color: COLORS.primary },

  // ── Búsqueda (SearchBar container) ──────────────────────────
  searchBarFlex: { flex: 1, minWidth: 180 },

  // ── DetalleMantenimiento — encabezado ticket ─────────────────
  ticketHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  infoBlock: { marginBottom: 16 },
  infoBlockSmall: { marginBottom: 4 },
  infoLabel: { fontSize: 12, color: COLORS.textTertiary, marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary },
  infoValueLg: { fontSize: 15, fontWeight: "600", color: COLORS.textSecondary },
  infoValueDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  infoRow: { flexDirection: "row", marginBottom: 16, gap: 16 },
  infoRowItem: { flex: 1 },

  // ── DetalleMantenimiento — caja de costos ────────────────────
  costoBox: { backgroundColor: COLORS.surface, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: COLORS.secondary },
  costoProductoRow: { marginBottom: 6 },
  costoItalic: { color: COLORS.textTertiary, fontStyle: "italic" },

  // ── DetalleMantenimiento — tareas ────────────────────────────
  tareaItemContainer: { paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 6, backgroundColor: COLORS.white },
  tareaItemHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  tareaItemLeft: { flexDirection: "row", alignItems: "center" },
  tareaItemNombre: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary, marginLeft: 8 },
  tareaItemMeta: { fontSize: 11, color: COLORS.textTertiary, marginLeft: 22, marginTop: 2 },
  tareaItemMetaTop: { fontSize: 11, color: COLORS.textTertiary, marginLeft: 22, marginTop: 4, lineHeight: 16 },
  tareaItemMetaMin: { fontSize: 11, color: COLORS.textTertiary, marginLeft: 22, marginTop: 1 },
  tareaGapList: { gap: 6 },
  tareaEmptyText: { fontSize: 12, color: COLORS.textTertiary },

  // ── Estados de error ─────────────────────────────────────────
  errorText: { color: COLORS.error },
  btnMarginTop: { marginTop: 12 },


  alertTextDark: { color: COLORS.black },
  // filterButtonSpacing: defined above in FilterPanel inline section (line ~169)

  tableMobileScroll: { minWidth: 892 },

  // ── Botones footer (DetalleMantenimiento) ─────────────────────────
  // Reemplazan los estilos inline { flex: 1 } y { flex: 1, borderColor }
  btnFooterFlex: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 0 },
  btnFooterFlexError: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 0, borderColor: COLORS.error },
  // Btn Editar / Eliminar en DetalleMantenimiento
  btnCancel: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: COLORS.white, marginTop: 0 },

  // ── SelectorPills ───────────────────────────────────────────
  // Fila horizontal de pills (reemplaza { flexDirection, gap, flexWrap } inline)
  pillsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  // Botón pill individual (reemplaza el bloque inline en cada Button)
  pillButton: {
    flex: 1,
    marginTop: 0,
    paddingVertical: 8,
    minWidth: 80,
    borderColor: COLORS.primary,
  },
  // Pill activa (se combina con pillButton al estar seleccionada)
  pillButtonActive: {
    backgroundColor: COLORS.primaryLight,
  },

  // ── MantenimientoProductoSelect ──────────────────────────────
  // Wrapper del componente (reemplaza style={{ marginBottom: 12 }} inline)
  productoSelectWrapper: { marginBottom: 12 },
  // Wrapper con alerta de stock (reemplaza containerStyle condicional inline)
  productoSelectContainerWithAlert: { marginBottom: 4 },

  // ── DetalleMantenimiento: Badge de tarea realizada/pendiente ──────
  // Base del badge (layout estático); borderColor, backgroundColor y color
  // se aplican dinámicamente vía array de estilos.
  tareaBadgeBase: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tareaBadgeTextBase: {
    fontSize: 10,
    fontWeight: "600",
  },

  // ── AgregarMantenimiento / EditarMantenimiento ──────────────
  // Reemplaza containerStyle={{ marginBottom: 0 }} inline en DateInput e Input
  noMarginBottom: { marginBottom: 0 },
  // Reemplaza containerStyle={{ marginBottom: 12 }} inline (DateInput en EditarMantenimiento)
  marginBottom12: { marginBottom: 12 },
});

// ── Helpers para estilos dinámicos (reemplazan objetos inline en JSX) ────────
// Devuelve el estilo dinámico del badge "Realizada / Pendiente" en DetalleMantenimiento.
// Evita escribir { borderColor, backgroundColor } como objeto literal en el JSX.

/**
 * @param {boolean} realizada
 * @returns {{ borderColor: string, backgroundColor: string }}
 */
export function getTareaBadgeStyle(realizada) {
  return {
    borderColor: realizada ? COLORS.success : COLORS.textTertiary,
    backgroundColor: realizada ? COLORS.successLight : COLORS.surface,
  };
}

/**
 * @param {boolean} realizada
 * @returns {{ color: string }}
 */
export function getTareaBadgeTextStyle(realizada) {
  return { color: realizada ? COLORS.success : COLORS.textTertiary };
}

/**
 * Devuelve { borderColor: COLORS.error } si hasError es true, o null.
 * @param {boolean} hasError
 * @returns {object|null}
 */
export function getFieldErrorStyle(hasError) {
  return hasError ? { borderColor: COLORS.error } : null;
}
