/**
 * ESTILOS: ProductosSeleccionadosListStyles
 * Hoja de estilos del componente ProductosSeleccionadosList.
 *
 * @dependencies - COLORS de theme/colors
 * @validations  - Reemplaza estilos inline por clases estructuradas.
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

export const styles = StyleSheet.create({
  /** Contenedor raíz de la lista (reemplaza { gap: 10, marginBottom: 12 } inline) */
  listContainer: {
    gap: 10,
    marginBottom: 12,
  },

  /** Tarjeta individual de producto (reemplaza el View inline con backgroundColor hardcodeado) */
  productoCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },

  /** Fila superior: nombre/detalles a la izquierda, botón Eliminar a la derecha */
  fila1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /** Columna de info (nombre + categoría) */
  infoCol: {
    flex: 1,
    marginRight: 10,
  },

  /** Nombre del producto */
  nombreText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  /** Categoría del producto */
  categoriaText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
  },

  /** Botón Eliminar producto */
  btnEliminar: {
    borderColor: COLORS.error,
    height: 32,
    paddingVertical: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },

  /** Texto del botón Eliminar */
  btnEliminarText: {
    color: COLORS.error,
    fontSize: 11,
    fontWeight: '600',
  },

  /** Fila inferior: selector de cantidad (izquierda) + subtotal (derecha) */
  fila2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /** Grupo del selector de cantidad */
  cantidadGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  /** Etiqueta "Cantidad:" */
  cantidadLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  /** Contenedor del control ± */
  cantidadControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 4,
  },

  /** Botón – y + */
  cantidadBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Input de cantidad (TextInput) */
  cantidadInput: {
    width: 55,
    height: 32,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 6,
    paddingVertical: 0,
    paddingHorizontal: 4,
  },

  /** Columna del subtotal */
  subtotalCol: {
    alignItems: 'flex-end',
  },

  /** Etiqueta "Subtotal:" */
  subtotalLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },

  /** Valor del subtotal */
  subtotalValor: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
