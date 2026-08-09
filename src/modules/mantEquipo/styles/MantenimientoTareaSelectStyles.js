/**
 * ESTILOS: MantenimientoTareaSelectStyles
 * Hoja de estilos del componente MantenimientoTareaSelect.
 *
 * @dependencies - COLORS de theme/colors
 * @validations  - Alineación y espaciados estandarizados para la fila de carga.
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

export const styles = StyleSheet.create({
  /** Fila de loading (spinner + texto) */
  loadingRow: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },

  /** Texto de "Cargando tareas..." */
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  /** Contenedor del mensaje de error */
  errorContainer: {
    marginBottom: 12,
  },

  /** Texto de error */
  errorText: {
    color: COLORS.error,
    fontSize: 13,
  },

  /** containerStyle del Select (reemplaza { marginBottom: 12 } inline) */
  selectContainer: {
    marginBottom: 12,
  },

  /** Estilo de error en el select (borderColor rojo) */
  selectError: {
    borderColor: COLORS.error,
  },
});
