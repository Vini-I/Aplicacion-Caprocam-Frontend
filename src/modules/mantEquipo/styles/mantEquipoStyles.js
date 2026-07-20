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
import { STYLE } from "../../../theme/style.js";

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
  btnAddTask:    { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: COLORS.warning, backgroundColor: COLORS.white, gap: 6, marginTop: 0 },
  btnVerEquipos: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: COLORS.warning, backgroundColor: COLORS.white, gap: 6, marginTop: 0 },
  btnAddMaint:   { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.white, gap: 6, marginTop: 0 },
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
  colTitle:  { flex: 1.2, minWidth: 100 },
  colDesc:   { flex: 2, minWidth: 140 },
  colBy:     { flex: 1, minWidth: 90 },
  colActions: { width: 110, alignItems: "center", justifyContent: "center" },
  headerCell:   { fontSize: 12, fontWeight: "700", color: COLORS.textSecondary },
  row:          { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: COLORS.secondary, gap: 12 },
  ticketLink:   { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  cellText:     { fontSize: 12, color: COLORS.textSecondary },
  cellTextSub:  { fontSize: 11, color: COLORS.textTertiary, marginTop: 1 },

  // ── Badges ─────────────────────────────────────────────────
  badgeEnMant:    { backgroundColor: COLORS.secondary,  paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start" },
  badgeFuera:     { backgroundColor: COLORS.errorLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start" },
  badgeText:      { fontSize: 11, fontWeight: "700", color: COLORS.textSecondary },
  badgeTextFuera: { fontSize: 11, fontWeight: "700", color: COLORS.error },

  // ── Footer y Botones Comunes ────────────────────────────────

  formFooter:        { flexDirection: "row", gap: 10, marginTop: 16 },
  btnCancel:         { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  btnAccept:         { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderColor: COLORS.primary },

  btnTextPrimary:    { color: COLORS.primary, fontWeight: "600", fontSize: 13 },
  btnTextPrimaryBold: { color: COLORS.primary, fontWeight: "700", fontSize: 13 },
  btnTextError:      { color: COLORS.error, fontWeight: "600", fontSize: 13 },
  btnTextPrimary14:  { color: COLORS.primary, fontWeight: "600", fontSize: 14 },
  btnTextError14:    { color: COLORS.error, fontWeight: "600", fontSize: 14 },



  // ── Formularios Agregar / Editar ────────────────────────────

  halfCol:           { flex: 1, minWidth: 120 },
  comboContainer:    { marginBottom: 12 },
  comboLabel:        { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary, marginBottom: 6 },
  comboInput:        { borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, color: COLORS.textSecondary, backgroundColor: COLORS.white },

  equipoDetailCard:  { backgroundColor: COLORS.surface, borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.secondary },
  equipoDetailRow:   { flexDirection: "row", marginBottom: 4, gap: 6 },
  equipoDetailLabel: { fontSize: 12, color: COLORS.textTertiary, width: 90 },
  equipoDetailVal:   { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary, flex: 1 },

  // Estandarización de botones de agregado en parte inferior
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
  },
  btnAddTaskBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.warning,
    backgroundColor: COLORS.white,
    gap: 6,
    flex: 1,
    maxWidth: 440,
    marginTop: 0,
  },
  btnAddMaintBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    gap: 6,
    flex: 1,
    maxWidth: 440,
    marginTop: 0,
  },
  btnActionOutline: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    backgroundColor: COLORS.white,
    marginTop: 0,
  },
  btnActionOutlineText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },


  // ── Sección Título (icon + texto) ───────────────────────────
  sectionTitleRow:  { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  sectionTitleIcon: { marginRight: 8 },
  sectionTitleText: { fontSize: 14, fontWeight: "700", color: COLORS.textSecondary, letterSpacing: 0.3 },

  // ── Layout de pantallas de formulario ───────────────────────
  screenFormContent: { paddingBottom: 40, gap: 16 },
  cardSection:       { padding: 16 },

  // ── Campo solo lectura (Creado por) ─────────────────────────
  readOnlyField:     { backgroundColor: COLORS.surface },
  readOnlyText:      { fontSize: 14, color: COLORS.textSecondary },

  // ── Input multilinea (Descripción) ──────────────────────────
  inputMultiline:    { minHeight: 80, textAlignVertical: "top" },

  // ── Select con altura mínima ─────────────────────────────────
  selectMinHeight:   { minHeight: 45 },

  // ── Preview de costo total ───────────────────────────────────
  costoTotalBox:     { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary, borderWidth: 1, borderRadius: 8, padding: 12, marginVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  costoTotalLabel:   { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary },
  costoTotalValor:   { fontSize: 16, fontWeight: "700", color: COLORS.primary },

  // ── Alerta de validación ─────────────────────────────────────
  alertValidacion:       { marginVertical: 12, alignItems: "center", justifyContent: "center", width: "100%" },
  alertValidacionTexto:  { color: COLORS.black, fontWeight: "600", fontSize: 13, textAlign: "center", width: "100%" },
  alertTopMargin:        { marginTop: 12, alignItems: "center", justifyContent: "center", width: "100%" },
  alertSecondMargin:     { marginTop: 8, alignItems: "center", justifyContent: "center", width: "100%" },

  // ── Pantalla Principal (ManteniminetoPrincipal) ──────────────
  screenRoot:            { flex: 1, backgroundColor: COLORS.white },
  screenScrollContent:   { flexGrow: 1 },
  toolbarWithZIndex:     { zIndex: 10, marginTop: 12 },
  alertBottom:           { marginBottom: 14 },
  emptyState:            { padding: 24, alignItems: "center" },
  emptyStateText:        { color: COLORS.textTertiary, fontSize: 14 },
  bottomButtonsRow:      { flexDirection: "row", width: "100%", gap: 12, marginTop: 16 },
  btnLabelPrimary:       { color: COLORS.primary },
  btnLabelWarning:       { color: COLORS.warning },

  // ── Spinner centrado ─────────────────────────────────────────
  spinnerContainer:      { justifyContent: "center", alignItems: "center" },

  // ── Detalles costos (DetalleMantenimiento) ───────────────────
  costoTotalRow:         { borderTopWidth: 1, borderTopColor: COLORS.secondary, paddingTop: 6, marginTop: 4 },
  costoTotalRowLabel:    { fontWeight: "700", color: COLORS.primary },
  costoTotalRowValor:    { fontWeight: "700", color: COLORS.primary },

  // ── Búsqueda (SearchBar container) ──────────────────────────
  searchBarFlex:         { flex: 1, minWidth: 180 },

  // ── DetalleMantenimiento — encabezado ticket ─────────────────
  ticketHeaderRow:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  infoBlock:             { marginBottom: 16 },
  infoBlockSmall:        { marginBottom: 4 },
  infoLabel:             { fontSize: 12, color: COLORS.textTertiary, marginBottom: 2 },
  infoValue:             { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary },
  infoValueLg:           { fontSize: 15, fontWeight: "600", color: COLORS.textSecondary },
  infoValueDesc:         { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  infoRow:               { flexDirection: "row", marginBottom: 16, gap: 16 },
  infoRowItem:           { flex: 1 },

  // ── DetalleMantenimiento — caja de costos ────────────────────
  costoBox:              { backgroundColor: COLORS.surface, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: COLORS.secondary },
  costoProductoRow:      { marginBottom: 6 },
  costoItalic:           { color: COLORS.textTertiary, fontStyle: "italic" },

  // ── DetalleMantenimiento — tareas ────────────────────────────
  tareaItemContainer:    { paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 6, backgroundColor: COLORS.white },
  tareaItemHeader:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  tareaItemLeft:         { flexDirection: "row", alignItems: "center" },
  tareaItemNombre:       { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary, marginLeft: 8 },
  tareaItemMeta:         { fontSize: 11, color: COLORS.textTertiary, marginLeft: 22, marginTop: 2 },
  tareaItemMetaTop:      { fontSize: 11, color: COLORS.textTertiary, marginLeft: 22, marginTop: 4, lineHeight: 16 },
  tareaItemMetaMin:      { fontSize: 11, color: COLORS.textTertiary, marginLeft: 22, marginTop: 1 },
  tareaGapList:          { gap: 6 },
  tareaEmptyText:        { fontSize: 12, color: COLORS.textTertiary },
  tareasCard:            { padding: 16 },

  // ── Estados de error ─────────────────────────────────────────
  errorText:             { color: COLORS.error },
  btnMarginTop:          { marginTop: 12 },

  // ── Texto de botones de acción ───────────────────────────────
  btnTextPrimary:        { color: COLORS.primary, fontWeight: "600" },
  btnTextError:          { color: COLORS.error, fontWeight: "600" },
});


