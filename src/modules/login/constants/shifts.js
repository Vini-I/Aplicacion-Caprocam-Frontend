/**
 * ============================================================
 * CONSTANTES: Turnos Disponibles
 * ============================================================
 *
 * Define los turnos disponibles en la aplicación.
 * Estructura centralizada para fácil mantenimiento.
 *
 * USO:
 * import { SHIFTS } from '../constants/shifts';
 */

export const SHIFTS = [
  {
    id: 'morning',
    label: 'Mañana',
    icon: require('../../../assets/morning.png'),
    timeRange: '6:00 AM - 2:00 PM',
    backgroundColor: '#FFD700',
  },
  {
    id: 'afternoon',
    label: 'Tarde',
    icon: require('../../../assets/afternoon.png'),
    timeRange: '2:00 PM - 10:00 PM',
    backgroundColor: '#FF8C00',
  },
  {
    id: 'night',
    label: 'Noche',
    icon: require('../../../assets/night.png'),
    timeRange: '10:00 PM - 6:00 AM',
    backgroundColor: '#9B7DD9',
  },
];
