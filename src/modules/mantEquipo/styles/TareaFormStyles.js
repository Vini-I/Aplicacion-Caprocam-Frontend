/**
 * ESTILOS: TareaFormStyles
 * Estilos específicos para el formulario de creación y modificación de tareas (TareaFormScreen).
 *
 * @dependencies - colors.js (theme/colors.js), typography.js (theme/typography.js)
 * @validations  - Define espaciados, bordes y layout de las secciones del formulario.
 * @navigation   - Ninguna
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  card: {
    padding: 16,
    marginBottom: 0,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  label: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 14,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  productosSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingTop: 16,
  },
  sectionLabel: {
    marginBottom: 8,
  },
  searchBarContainer: {
    marginBottom: 8,
  },
  listaProductosDisponibles: {
    maxHeight: 120,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemProducto: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    marginTop: 0,
    borderRadius: 0,
    backgroundColor: COLORS.surface,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  itemProductoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'left',
  },
  productoSeleccionadoContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  cantidadInput: {
    marginBottom: 8,
  },
  botonesProducto: {
    flexDirection: 'row',
    gap: 8,
  },
  btnCancelarProducto: {
    flex: 1,
    borderColor: COLORS.textTertiary,
  },
  btnAgregarProducto: {
    flex: 1,
    borderColor: COLORS.primary,
  },
  contenidoBotonProducto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listaProductosSeleccionados: {
    marginTop: 8,
  },
  itemProductoSeleccionado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  itemProductoSeleccionadoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  btnEliminarProducto: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    minWidth: 30,
    height: 30,
    borderColor: COLORS.error,
  },
  alert: {
    marginBottom: 0,
  },
  alertText: {
    textAlign: 'center',
  },
  alertSection: {
    marginTop: 16,
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  botonLabelPrimary: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  btnCancelar: {
    flex: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  btnGuardar: {
    flex: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  contenidoBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
    searchInputContainer: {
    marginBottom: 8,
  },
  searchInput: {
    minHeight: 40,
    borderRadius: 8,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  selectProductoContainer: {
    marginBottom: 12,
  },
  selectProducto: {
    minHeight: 44,
    borderRadius: 8,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  sectionTitle:{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});