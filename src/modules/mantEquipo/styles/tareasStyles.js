/**
 * ESTILOS: tareasStyles
 * Estilos globales para las pantallas y componentes del catálogo de tareas (TareasScreen, DetalleTareaScreen).
 *
 * @dependencies - colors.js (theme/colors.js), style.js (theme/style.js)
 * @validations  - Define estilos de tabla, modales, listas y tarjetas de tareas.
 * @navigation   - Ninguna
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';
import { STYLE } from '../../../theme/style';

export const styles = StyleSheet.create({
  // Contenedor principal de la pantalla
  // Ajuste del scroll principal para que deje espacio al footer flotante
  screenScrollContent: { flexGrow: 1, paddingBottom: 110 },

  // Barra de herramientas (búsqueda + filtros)
toolbar: {
    flexDirection: "row",
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    gap: 8,
},

  searchBarContainer: {
    flex: 1,
  },

  filterButtonStyle: {
    height: 42,
    borderColor: COLORS.textTertiary,
    marginTop: 0,
    alignSelf: "center",
  },

  // Alerta global
  alertWrapper: {
    marginBottom: 12,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
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
  maxWidth: 900,          // ← Agregar para que las filas tengan el mismo ancho
  alignSelf: 'center',    // ← Centrar
  width: '100%',          // ← Asegurar que ocupe todo el ancho dentro del maxWidth
},

  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },

  emptyText: {
    color: COLORS.textTertiary,
    fontSize: 14,
  },


  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskCardState: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  taskCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  taskCardDescription: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: 12,
  },
  taskCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  taskCardMeta: {
    fontWeight: "600",
    fontSize: 12,
    color: COLORS.black,
  },
  taskTitle: {
    fontSize: 20, 
    fontWeight: "700", 
    color: COLORS.primary 
  },

  // Botón flotante "Agregar tarea"
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  floatingButton: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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

  // Centro de carga/error
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── DetalleTareaScreen ──────────────────────────────────
  // Contenedor de pantalla mientras carga (reemplaza { justifyContent, alignItems } inline)
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Contenedor de pantalla de error (mismo layout que loading)
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Texto de error en pantalla de error
  errorText: {
    color: COLORS.error,
  },
  // Wrapper del Alert de acción (reemplaza { marginBottom: 12 } inline)
  alertMarginBottom: {
    marginBottom: 12,
  },
  // Fila de botones Editar / Eliminar (reemplaza { flexDirection, gap, marginTop } inline)
  botonesRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  // Botón Editar en DetalleTarea (reemplaza { flex: 1, borderColor: COLORS.primary } inline)
  botonDetalleEditar: {
    flex: 1,
    borderColor: COLORS.primary,
  },
  // Botón Eliminar en DetalleTarea (reemplaza { flex: 1, borderColor: COLORS.error } inline)
  botonDetalleEliminar: {
    flex: 1,
    borderColor: COLORS.error,
  },
  // Fila interior de cada botón (reemplaza { flexDirection, alignItems, gap } inline)
  botonInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  // Texto del botón Editar
  botonTexto: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Texto del botón Eliminar
  botonTextoEliminar: {
    color: COLORS.error,
    fontWeight: '600',
  },
  // Flex para el View de productos en ModalDetalleTarea
  productosListFlex: {
    flex: 1,
  },

  // ── DetalleEquipoScreen ───────────────────────────────────
  // Texto de error (reemplaza { color: COLORS.error } inline)
  errorTextLine: {
    color: COLORS.error,
  },

  // ── FilaTarea — estado en negrita ─────────────────────────
  // Reemplaza [styles.cellText, { fontWeight: '600' }] inline
  cellTextBold: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});

// ============================================================
// ESTILOS ADICIONALES PARA DETALLE DE EQUIPO Y TAREA
// (movidos desde los screens para mantener orden)
// ============================================================

// Estilos para filas con ícono (usado en DetalleEquipo y DetalleTarea)
export const detalleStyles = StyleSheet.create({

  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconoWrapper: {
    width: 28,
    alignItems: 'center',
    marginRight: 10,
  },
  contenido: {
    flex: 1,
  },
  etiqueta: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  valor: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  valorLink: {
    fontSize: 15,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});

// Estilos específicos para la pantalla DetalleEquipo
export const equipoDetalleStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codigo: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoBadgeContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  estadoBadgeText: {
    fontWeight: '600',
    fontSize: 12,
  },
  horasContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  horasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  horasLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  horasLabel: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  horasValor: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  horasValorCritico: {
    color: COLORS.error,
  },
  horasValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horasAlertIcon: {
    marginRight: 6,
  },
  historialTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  registroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  registroFecha: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  registroHoras: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  boton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginTop: 0,
  },
  botonEditar: {
    borderColor: COLORS.primary,
  },
  botonEliminar: {
    borderColor: COLORS.error,
  },
  botonTexto: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  botonTextoEliminar: {
    color: COLORS.error,
    fontWeight: '600',
  },
  alertWrapper: {
    marginBottom: 12,
  },
});