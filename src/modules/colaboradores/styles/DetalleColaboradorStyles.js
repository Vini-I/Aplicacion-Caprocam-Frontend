/**
 * ESTILOS: DetalleColaboradorStyles
 * Agrupa las hojas de estilo de la pantalla de detalle de colaborador,
 * incluyendo información personal, trabajadores a cargo y botones de acción.
 *
 * @dependencies - COLORS de theme/colors.js, TYPOGRAPHY de theme/typography.js
 * @validations  - N/A
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';

export const styles = StyleSheet.create({
  // ── Cabecera con avatar ─────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  avatarIniciales: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },

  // ── Badge de rol alineado con los iconos ────────────────────
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    marginVertical: 5,
    marginBottom: 5,
  },
  badgeRol: {
    alignSelf: 'flex-start',
  },

  // ── Separador y título de sección ──────────────────────────
  separator: {
    height: 1,
    backgroundColor: COLORS.secondary,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  // ── Filas de detalle con ícono ──────────────────────────────
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
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },

  // ── Trabajadores a cargo (dueño externo) ──────────────────
  trabajadorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  trabajadorInfo: {
    flex: 1,
  },
  trabajadorNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  trabajadorDetalle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    textAlign: 'center',
    paddingVertical: 12,
  },

  // ── Botones de acción ──────────────────────────────────────
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
  botonTextoEditar: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  botonTextoEliminar: {
    color: COLORS.error,
    fontWeight: '600',
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});