/**
 * ============================================================
 * ESTILOS: tareasStyles
 * ============================================================
 *
 * Estilos para la pantalla TareasScreen.
 * Utiliza la paleta de COLORS del tema central.
 *
 * Dependencias:
 * - COLORS desde theme/colors
 *
 * Ejemplo de uso:
 * import { styles } from './tareasStyles';
 * <View style={styles.screen}>...</View>
 */

// ============================================================
// IMPORTS
// ============================================================
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

// ============================================================
// EXPORTACIÓN DE ESTILOS
// ============================================================
export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },

  navbarTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "left",
  },

  navbarSubtitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "400",
    marginTop: 2,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    maxWidth: 960,
    width: "100%",
    alignSelf: "center",
  },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
  },

  searchBox: {
    flex: 1,
    minWidth: 180,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    height: 42,
    gap: 6,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  btnAdd: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: "transparent",
  },

  btnLabel: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 13,
  },

  tableWrapper: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.white,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  headerCell: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  // Columnas de la tabla
  colId: { width: 60 },
  colNombre: { flex: 1.5, minWidth: 100 },
  colDesc: { flex: 2, minWidth: 140 },
  colCategoria: { flex: 1, minWidth: 90 },
  colDuracion: { width: 80 },
  colAcciones: { width: 90 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
  },

  cellText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

// ============================================================
// ESTILOS DE BOTONES DE ACCIÓN (outline)
// ============================================================
btnAction: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 8,
  borderWidth: 1,
  backgroundColor: "transparent",
  height: 42,
  marginTop: 0,
},

  // Modal de tarea
  modalContainer: {
    maxHeight: "92%",
    maxWidth: 600,
    width: "100%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 14,
  },

  modalScroll: {
    maxHeight: 480,
  },

  modalFooter: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  btnCancel: {
    flex: 1,
  },

  btnAccept: {
    flex: 1,
  },
  btnAdd: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  backgroundColor: COLORS.primary,
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderWidth: 0,
  height: 42,
},
addButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},
btnLabel: {
  color: COLORS.white,
  fontWeight: '600',
  fontSize: 13,
},
});