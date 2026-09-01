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
import { useError } from '../../../shared/context/ErrorContext';

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
  const { mostrarError } = useError();

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
      // Errores HTTP del backend (401, 409, etc.) → Alert inline del formulario
      // Errores de storage (saveToken/saveUsuario lanzan Error sin response) → ModalError global
      if (error?.response) {
        // Error HTTP: mostrar en el formulario como serverError
        const msg = error.response?.data?.message || error.message || 'Error al iniciar sesión.';
        setServerError(msg);
      } else if (
        error?.message?.includes('sesión') ||
        error?.message?.includes('token') ||
        error?.message?.includes('usuario') ||
        error?.message?.includes('almacenamiento')
      ) {
        // Error de storage → modal global
        mostrarError(error);
      } else {
        // Cualquier otro error (ej. red, timeout de axios mapeado a Error) → formulario
        setServerError(error.message || 'Error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, serverError, setServerError, submit };
};