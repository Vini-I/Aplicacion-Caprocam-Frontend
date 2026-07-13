/**
 * ============================================================
 * ESTILOS: tareasStyles
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Estilos para la pantalla TareasScreen.
 * Utiliza la paleta de COLORS del tema central.
 *
 * Dependencias:
 * - COLORS desde theme/colors
 * ============================================================
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  // Contenedor principal de la pantalla
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  // Barra de herramientas (búsqueda + botón agregar)
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },

  // Botón de acción (outline)
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

  // Alerta global (mismo ancho que la barra de búsqueda)
  alertWrapper: {
    marginBottom: 12,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },

  // Contenedor de la tabla (ocupa todo el espacio restante)
  tableWrapper: {
    flex: 1,
    width: '100%',
  },
    rowInner: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },

  // Ajusta tableHeader para que use rowInner
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  // Contenedor interno de la tabla para centrar y limitar ancho
  tableInner: {
    flex: 1,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },

  // Cabecera de la tabla (fija)
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

  // Columnas
  colId: { width: 60 },
  colNombre: { flex: 1.5, minWidth: 100 },
  colDesc: { flex: 2, minWidth: 140 },
  colCategoria: { flex: 1, minWidth: 90 },
  colDuracion: { width: 80 },
  colAcciones: { width: 90 },

  // Fila de la tabla
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

  // Botones de acción dentro de la fila (editar/eliminar) - outline
  btnAccion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: "transparent",
    marginTop: 0,
    minWidth: 36,
    height: 32,
  },

  // Modal de tarea (creación/edición)
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
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: "transparent",
  },

  btnAccept: {
    flex: 1,
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: "transparent",
  },

  // Modal de confirmación de eliminación
  modalConfirmContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    maxHeight: "80%",
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.error,
    marginBottom: 16,
    textAlign: "center",
  },

  modalText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginBottom: 8,
    textAlign: "center",
  },

  modalName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },

  modalSubText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginBottom: 8,
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },

  modalCancelBtn: {
    flex: 1,
    marginTop: 0,
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: "transparent",
  },

  modalDeleteBtn: {
    flex: 1,
    marginTop: 0,
    borderColor: COLORS.error,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
});