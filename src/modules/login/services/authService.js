/**
 * ============================================================
 * AUTH SERVICE
 * ============================================================
 *
 * Para autenticar usuarios mediante JSON Web Tokens (JWT).
 *
 */

import { AUTH_MESSAGES } from '../constants/authMessages';

const API_BASE_URL = 'https://api.caprocam.com';

// FUNCIONES DEL SERVICIO

/**
 * Envía las credenciales al backend y retorna el JWT si son correctas.
 *
 * @param {string} username 
 * @param {string} password
 * @returns {Promise<Object>}
 * @throws {Error}
 *
 */
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim(),
        password,
      }),
    });

    // Parsear la respuesta como JSON
    const data = await response.json();

    // Si el servidor respondió con error (401, 403, 500, etc.)
    if (!response.ok) {
      // Usar el mensaje del servidor si lo trae, si no usar el genérico
      if (response.status === 401) {
        throw new Error(AUTH_MESSAGES.ERROR_INVALID_CREDENTIALS);
      }
      if (response.status >= 500) {
        throw new Error(AUTH_MESSAGES.ERROR_SERVER);
      }
      throw new Error(data.message || AUTH_MESSAGES.ERROR_UNKNOWN);
    }

    // Login exitoso 
    return {
      token: data.token,
      user: data.user,
    };

  } catch (error) {
    // Si el error es de red (sin conexión), no tiene response
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(AUTH_MESSAGES.ERROR_NETWORK);
    }

    // Re-lanzar errores que ya tienen mensaje apropiado
    throw error;
  }
};

/**
 * Registra un nuevo usuario en el sistema.
 *
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>} 
 * @throws {Error} 
 */
export const register = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim(),
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error(AUTH_MESSAGES.ERROR_SERVER);
      }
      throw new Error(data.message || AUTH_MESSAGES.ERROR_UNKNOWN);
    }

    return {
      token: data.token,
      user: data.user,
    };

  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(AUTH_MESSAGES.ERROR_NETWORK);
    }
    throw error;
  }
};
