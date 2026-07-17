/**
 * ============================================================
 * ESTILOS: tareasStyles
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Estilos para la pantalla TareasScreen y sus componentes.
 * Utiliza la paleta de COLORS del tema central.
 *
 * Dependencias:
 * - COLORS desde theme/colors
 * ============================================================
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

export const styles = StyleSheet.create({
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 80,
  },

  // Barra de herramientas (búsqueda + filtros)
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },

  searchBarContainer: {
    flex: 1,
  },

  filterButtonStyle: {
    height: 42,
    borderColor: COLORS.textTertiary,
    marginTop: 0,
    alignSelf: 'center',
  },

  // Alerta global
  alertWrapper: {
    marginBottom: 12,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },

  // Tabla
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

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  // Columnas
  colId: { width: 60 },
  colNombre: { flex: 1.5, minWidth: 100 },
  colDesc: { flex: 2, minWidth: 140 },
  colCategoria: { flex: 1, minWidth: 90 },
  colDuracion: { width: 90 },
  colEstado: { width: 110, minWidth: 90 },
  colAcciones: { width: 180 },

  // Fila
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
  },

  cellText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  // Botones de acción en fila
  accionesContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  btnAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginTop: 0,
    minWidth: 36,
    height: 32,
  },

  btnAccionEditar: {
    borderColor: COLORS.primary,
  },

  btnAccionEliminar: {
    borderColor: COLORS.error,
  },

  btnAccionText: {
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4,
  },

  // FlatList
  flatList: {
    flex: 1,
    width: '100%',
  },

  flatListContent: {
    flexGrow: 1,
  },

  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },

  emptyText: {
    color: COLORS.textTertiary,
    fontSize: 14,
  },

  // Botón flotante "Agregar tarea" (mismo ancho que la tabla)
floatingButtonContainer: {
  position: 'absolute',
  bottom: 20,
  left: 0,
  right: 0,
  alignItems: 'center',
  paddingHorizontal: 16,
},

floatingButton: {
  width: '100%',
  maxWidth: 900,
  alignSelf: 'center',   // para que respete el maxWidth y se centre
  backgroundColor: 'transparent', // el Button con variant="outline" ya tiene fondo blanco
  borderColor: COLORS.primary,
  borderWidth: 1,
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 6,
},

  floatingButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },

  // Modal de detalle
  modalContainer: {
    maxHeight: '92%',
    maxWidth: 600,
    width: '100%',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 14,
  },

  modalScroll: {
    maxHeight: 480,
  },

  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  btnCancel: {
    flex: 1,
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },

  btnCancelCerrar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  btnCancelText: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Modal de confirmación de eliminación
  modalConfirmContainer: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    maxHeight: '80%',
    padding: 16,
  },

  modalText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginBottom: 8,
    textAlign: 'center',
  },

  modalName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },

  modalSubText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginBottom: 8,
    textAlign: 'center',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },

  modalCancelBtn: {
    flex: 1,
    marginTop: 0,
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },

  modalCancelBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  modalCancelBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  modalDeleteBtn: {
    flex: 1,
    marginTop: 0,
    borderColor: COLORS.error,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },

  modalDeleteBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  modalDeleteBtnText: {
    color: COLORS.error,
    fontWeight: '600',
  },

  // Estilos para el detalle (usados en ModalDetalleTarea)
  detalleEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  detalleRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    gap: 6,
  },

  equipoDetailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textTertiary,
    width: 110,
  },

  equipoDetailVal: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.textSecondary,
    flex: 1,
  },
});