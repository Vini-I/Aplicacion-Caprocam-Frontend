/**
 * HOOK: useAuthRequest
 * Encapsula la ejecución de peticiones asíncronas de autenticación (login y registro web),
 * gestionando estados de carga, errores del servidor y guardado de token de sesión.
 *
 * @dependencies - saveToken, saveUsuario (utils/tokenStorage.js)
 * @validations  - Ejecuta la petición solo si el formulario es válido (isFormValid).
 * @navigation   - N/A (ejecuta el callback onSuccess al autenticar).
 */

import { useState } from 'react';
import { saveToken, saveUsuario, saveRefreshToken } from '../utils/tokenStorage';

/**
 * useAuthRequest({ onSuccess })
 *
 * @param {Object} params
 * @param {Function} params.onSuccess - se ejecuta tras guardar el token
 * @returns {Object} { loading, serverError, setServerError, submit }
 */
export const useAuthRequest = ({ onSuccess = () => { } } = {}) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  /**
   * submit(requestFn, isFormValid)
   *
   * Ejecuta requestFn() (una llamada a authService) solo si el
   * formulario es válido, maneja loading/error y guarda el token.
   *
   * @param {Function} requestFn - () => Promise<{ token, user }>
   * @param {boolean} isFormValid
   */
  const submit = async (requestFn, isFormValid) => {
    setServerError(null);

    if (!isFormValid) {
      return;
    }

    setLoading(true);

    try {
      const { token, refreshToken, user } = await requestFn();
      if (token) saveToken(token);
      if (refreshToken) saveRefreshToken(refreshToken);
      if (user) saveUsuario(user);
      onSuccess();
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, serverError, setServerError, submit };
};