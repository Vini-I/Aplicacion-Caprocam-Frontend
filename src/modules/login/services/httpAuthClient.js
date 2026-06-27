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

const API_BASE_URL = 'https://api.caprocam.com';

/**
 * mapStatusError(status, data, statusMessages)
 *
 * Traduce un status HTTP de error a un mensaje legible.
 * `statusMessages` permite que cada llamada (login/register)
 * sobrescriba el mensaje para un status específico (ej. 401).
 */
const mapStatusError = (status, data, statusMessages) => {
  if (statusMessages[status]) {
    return new Error(statusMessages[status]);
  }
  if (status >= 500) {
    return new Error(AUTH_MESSAGES.ERROR_SERVER);
  }
  return new Error(data.message || AUTH_MESSAGES.ERROR_UNKNOWN);
};

/**
 * postAuth(endpoint, body, statusMessages)
 *
 * Hace un POST JSON al endpoint de autenticación indicado y
 * retorna { token, user }. Lanza un Error con mensaje legible
 * si la respuesta falla o si no hay conexión de red.
 *
 * @param {string} endpoint - ej. '/api/auth/login'
 * @param {Object} body - cuerpo de la petición
 * @param {Object} [statusMessages] - { [statusCode]: mensaje }
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const postAuth = async (endpoint, body, statusMessages = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw mapStatusError(response.status, data, statusMessages);
    }

    return { token: data.token, user: data.user };
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(AUTH_MESSAGES.ERROR_NETWORK);
    }
    throw error;
  }
};