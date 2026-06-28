/**
 * ============================================================
 * HOOK: useAuthRequest
 * ============================================================
 *
 * Encapsula el flujo común a login y registro: estado de
 * loading, manejo de error del servidor y guardado del JWT
 * en caso de éxito. useAuth.js y useRegister.js lo usan para
 * no duplicar este flujo.
 */

import { useState } from 'react';
import { saveToken } from '../utils/tokenStorage';

/**
 * useAuthRequest({ onSuccess })
 *
 * @param {Object} params
 * @param {Function} params.onSuccess - se ejecuta tras guardar el token
 * @returns {Object} { loading, serverError, submit }
 */
export const useAuthRequest = ({ onSuccess = () => {} } = {}) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  /**
   * submit(requestFn, isFormValid)
   *
   * Ejecuta requestFn() (una llamada a authService) solo si el
   * formulario es válido, maneja loading/error y guarda el token.
   *
   * @param {Function} requestFn - () => Promise<{ token }>
   * @param {boolean} isFormValid
   */
  const submit = async (requestFn, isFormValid) => {
    setServerError(null);

    if (!isFormValid) {
      return;
    }

    setLoading(true);

    try {
      const { token } = await requestFn();
      saveToken(token);
      onSuccess();
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, serverError, submit };
};