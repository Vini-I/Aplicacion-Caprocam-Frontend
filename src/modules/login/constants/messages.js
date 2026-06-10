/**
 * ============================================================
 * CONSTANTES: Mensajes de Login
 * ============================================================
 *
 * Centraliza todos los textos mostrados en la pantalla de login.
 * Facilita cambios de mensajes y mantenimiento multiidioma futuro.
 *
 * USO:
 * import { LOGIN_MESSAGES } from '../constants/messages';
 */

export const LOGIN_MESSAGES = {
  // Sección de Turnos
  SHIFT_TITLE: 'Selecciona tu turno',
  SHIFT_SUBTITLE: '¿En qué horario vas a trabajar?',

  // Sección de Trabajadores
  WORKER_TITLE: '¿Quién está trabajando?',
  WORKER_SUBTITLE: 'Toca tu nombre para comenzar',

  // Estados de Carga
  LOADING: 'Cargando trabajadores...',
  ERROR_PREFIX: 'Error: ',

  // Botón
  BUTTON_TEXT: 'Comenzar turno →',

  // Empresa
  COMPANY_NAME: 'Caprocam',
};
