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
  WORKER_TITLE: 'Selecciona tu nombre',
  WORKER_SUBTITLE: 'Toca tu nombre para comenzar',

  // Estados de Carga
  LOADING: 'Cargando colaboradores...',
  ERROR_PREFIX: 'Error: ',
  NO_WORKERS_FOUND: 'No se encontraron colaboradores.',
  SEARCH_PLACEHOLDER: 'Buscar por nombre',
  SYNC_BUTTON_TEXT: 'Sincronizar Usuarios',

  // Botón
  BUTTON_TEXT: 'Continuar',

  // Empresa
  COMPANY_NAME: 'Caprocam',
};
