/**
 * ============================================================
 * HTTP CLIENT: Autenticación
 * ============================================================
 *
 * Helper compartido por authService.js para hacer peticiones
 * fetch hacia los endpoints de autenticación, manejando de
 * forma centralizada errores de red y de estatus HTTP. Antes
 * esta lógica estaba duplicada entre login() y register().
 */

import { AUTH_MESSAGES } from '../constants/authMessages';
import api from '../../../api/api';

/**
 * mapStatusError(status, data, statusMessages)
 *
 * Traduce un status HTTP de error a un mensaje legible.
 */
const mapStatusError = (status, data, statusMessages) => {
  if (statusMessages[status]) {
    return new Error(statusMessages[status]);
  }
  if (status >= 500) {
    return new Error(AUTH_MESSAGES.ERROR_SERVER);
  }
  return new Error(data?.message || AUTH_MESSAGES.ERROR_UNKNOWN);
};

/**
 * postAuth(endpoint, body, statusMessages)
 *
 * Hace un POST al endpoint de autenticación indicado y
 * retorna { token, user }.
 *
 * @param {string} endpoint - ej. '/login'
 * @param {Object} body - cuerpo de la petición
 * @param {Object} [statusMessages] - { [statusCode]: mensaje }
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const postAuth = async (endpoint, body, statusMessages = {}) => {
  try {
    const response = await api.post(endpoint, body);
    
    // Extraer datos usando la estructura que envía el backend Caprocam
    // { data: { accessToken, refreshToken, usuario } }
    const { accessToken, usuario } = response.data.data || {};

    return { token: accessToken, user: usuario };
  } catch (error) {
    if (error.response) {
      throw mapStatusError(error.response.status, error.response.data, statusMessages);
    }
    // Network error o backend apagado
    throw new Error(AUTH_MESSAGES.ERROR_NETWORK || 'Error de conexión con el servidor.');
  }
};