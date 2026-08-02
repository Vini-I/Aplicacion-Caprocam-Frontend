/**
 * ESTILOS: TareasSeleccionadasListStyles
 * Hoja de estilos del componente TareasSeleccionadasList.
 *
 * @dependencies - COLORS de theme/colors
 * @validations  - Reemplaza todos los estilos inline del componente.
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

export const styles = StyleSheet.create({
  /** Contenedor raíz de la lista (reemplaza { gap: 8, marginBottom: 12 } inline) */
  listContainer: {
    gap: 8,
    marginBottom: 12,
  },

  /** Tarjeta individual de tarea */
  tareaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 12,
  },

  /** Columna de info (nombre, categoría, duración, descripción) */
  infoCol: {
    flex: 1,
    marginRight: 12,
  },

  /** Nombre de la tarea */
  nombreText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  /** Texto de categoría */
  categoriaText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
  },

  /** Texto de duración estimada */
  duracionText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 1,
  },

  /** Texto de descripción */
  descripcionText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 4,
    lineHeight: 16,
  },

  /** Columna de acciones (botones Realizado y Eliminar) */
  accionesCol: {
    gap: 6,
    width: 90,
  },

  /** Botón base para acciones (Realizado / Eliminar) */
  btnAccion: {
    width: '100%',
    height: 32,
    paddingVertical: 0,
    paddingHorizontal: 10,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },

  /** Botón "Pendiente" (no realizado) */
  btnPendiente: {
    borderColor: COLORS.textTertiary,
    backgroundColor: 'transparent',
  },

  /** Botón "Realizado" (activo) */
  btnRealizado: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight,
  },

  /** Texto del botón cuando está pendiente */
  textPendiente: {
    color: COLORS.textTertiary,
    fontSize: 11,
    fontWeight: '600',
  },

  /** Texto del botón cuando está realizado */
  textRealizado: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '600',
  },

  /** Botón Eliminar tarea */
  btnEliminar: {
    borderColor: COLORS.error,
    backgroundColor: 'transparent',
  },

  /** Texto del botón Eliminar */
  textEliminar: {
    color: COLORS.error,
    fontSize: 11,
    fontWeight: '600',
  },
});
