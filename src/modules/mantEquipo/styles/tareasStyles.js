/**
 * ESTILOS: tareasStyles
 * Ruta: src/modules/mantEquipo/styles/tareasStyles.js
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

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
    backgroundColor: COLORS.primary,
  },

  btnLabel: {
    color: COLORS.white,
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
  colId:         { width: 60 },
  colNombre:     { flex: 1.5, minWidth: 100 },
  colDesc:       { flex: 2, minWidth: 140 },
  colCategoria:  { flex: 1, minWidth: 90 },
  colDuracion:   { width: 80 },
  colAcciones:   { width: 90 },

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

  btnAccion: {
    marginTop: 0,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    marginRight: 6,
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
});