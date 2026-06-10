/**
 * ============================================================
 * SISTEMA DE COLORES CENTRALIZADO
 * ============================================================
 *
 * Define todos los colores utilizados en la aplicación.
 * Esto permite mantener consistencia visual y facilita cambios globales.
 *
 * USO:
 * import { COLORS } from '../theme/colors';
 * backgroundColor: COLORS.primary,
 */

export const COLORS = {
  // Primarios
  primary: '#0066CC',
  secondary: '#0084D1',
  accent: '#FF8C00',

  // Neutrales
  white: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E0E0E0',
  divider: '#CCCCCC',

  // Texto
  text: {
    dark: '#333333',
    medium: '#666666',
    light: '#AAAAAA',
    muted: '#6c757d',
  },

  // Estados
  error: '#DC3545',
  success: '#198754',
  warning: '#FFC107',
  info: '#0DCAF0',

  // Específicos
  shiftMorning: '#FFD700',
  shiftAfternoon: '#FF8C00',
  shiftNight: '#9B7DD9',

  avatar: {
    background: '#E6F2FF',
    foreground: '#0066CC',
  },

  header: '#0066CC',
};
