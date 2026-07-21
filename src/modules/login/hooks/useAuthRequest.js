/**
 * ============================================================
 * HOOK: useAuthRequest
 * ============================================================
 * 
 * Responsabilidad: Encapsular el flujo común para peticiones de autenticación
 * (login y registro): loading, errores del servidor y tokenStorage.
 * 
 * FUNCIONALIDAD:
 * - Provee un método submit para ejecutar llamadas asíncronas y guardar el JWT token.
 * 
 * DATOS:
 * - loading: Estado de carga de la petición.
 * - serverError: Mensaje de error retornado por la consulta.
 * 
 * DEPENDENCIAS:
 * - tokenStorage.js
 */

import { useState } from 'react';
import { saveToken, saveUsuario } from '../utils/tokenStorage';

/**
 * useAuthRequest({ onSuccess })
 *
 * @param {Object} params
 * @param {Function} params.onSuccess - se ejecuta tras guardar el token
 * @returns {Object} { loading, serverError, submit }
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
      const { token, user } = await requestFn();
      if (token) saveToken(token);
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