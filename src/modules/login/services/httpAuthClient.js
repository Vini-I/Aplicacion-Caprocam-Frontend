/**
 * CLIENTE HTTP: httpAuthClient
 *
 * Encapsula la comunicación HTTP (fetch/axios) para los endpoints de autenticación,
 * procesando respuestas y estructurando errores de servidor y red de forma unificada.
 *
 * @dependencies - api (cliente HTTP centralizado)
 *               - AUTH_MESSAGES de constants/authMessages
 * @validations  - Mapeo centralizado de códigos de respuesta HTTP (401, 409, 422, 500).
 * @navigation   - N/A (cliente HTTP puro).
 */

import { AUTH_MESSAGES } from '../constants/authMessages';
import api from '../../../api/api';

/**
 * mapStatusError(status, data, statusMessages)
 *
 * Prioridad de mensajes:
 * 1. Mensaje explícito del backend (data.message) — fuente de verdad.
 * 2. Override del frontend por status (statusMessages) — solo cuando
 *    se sabe que el mensaje del backend sería demasiado técnico para
 *    mostrar al usuario (ej.: "Unauthorized" → "Credenciales incorrectas").
 * 3. Fallback genérico si el backend no responde con ningún mensaje.
 */
const mapStatusError = (status, data, statusMessages) => {
  // 1. El backend mandó un mensaje claro → usarlo
  if (data?.message) {
    return new Error(data.message);
  }
  // 2. Sin mensaje del backend → usar override legible del frontend si existe
  if (statusMessages[status]) {
    return new Error(statusMessages[status]);
  }
  // 3. Fallback genérico
  if (status >= 500) {
    return new Error(AUTH_MESSAGES.ERROR_SERVER);
  }
  return new Error(AUTH_MESSAGES.ERROR_UNKNOWN);
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