/**
 * ============================================================
 * ESTILOS: DetalleColaboradorStyles
 * ============================================================
 * Módulo: Colaboradores
 *
 * Estilos para la pantalla DetalleColaboradorScreen.
 * Utiliza la paleta de COLORS del tema central.
 *
 * Dependencias:
 * - COLORS desde theme/colors
 * ============================================================
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';

export const styles = StyleSheet.create({
  // Cabecera
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
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  badgeTexto: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  // Filas de detalle con ícono
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

  // Estadísticas
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 70,
    paddingVertical: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  lastActive: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },

  // Trabajadores a cargo
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

  // Botones
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
});