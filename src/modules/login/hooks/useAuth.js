/**
 * ============================================================
 * HOOK: useAuth
 * ============================================================
 *
 * Hook personalizado para manejar la lógica de autenticación
 * web con JWT.
 *
 * RESPONSABILIDADES:
 * 1. Manejar el estado del formulario (usuario, contraseña)
 * 2. Validar los campos antes de enviar
 * 3. Llamar a authService para autenticar contra la API
 * 4. Guardar el JWT con tokenStorage
 * 5. Exponer estados de loading y error a la pantalla
 *
 * ============================================================
 */

import { useState } from 'react';
import { login, register } from '../services/authService';
import { saveToken } from '../utils/tokenStorage';
import { validateAuthForm, isAuthFormValid, getAuthButtonVariant } from '../utils/authValidator';

/**
 * useAuth({ onLoginSuccess })
 *
 * Hook principal de autenticación.
 *
 * @param {Object} params
 * @param {Function} params.onLoginSuccess 
 * @returns {Object} 
 */
export const useAuth = ({ onLoginSuccess = () => {} } = {}) => {

  // Estado del formulario
  const [username, setUsername] = useState('');     
  const [password, setPassword] = useState('');     

  // Estado de la petición
  const [loading, setLoading] = useState(false);     
  const [serverError, setServerError] = useState(null); 

  // Validar el formulario en tiempo real (se recalcula en cada render)
  const errors = validateAuthForm(username, password);

  // ¿El formulario es válido para enviar?
  const isFormValid = isAuthFormValid(errors);

  // Variante del botón según validación
  const buttonVariant = getAuthButtonVariant(isFormValid);

  // FUNCIONES INTERNAS
  /**
   * @param {Function} authFunction - La función de authService a ejecutar
   */
  const _handleAuthFlow = async (authFunction) => {
    // Limpiar error previo del servidor
    setServerError(null);

    // Verificar validación del cliente antes de llamar a la API
    if (!isFormValid) {
      return;
    }

    setLoading(true);

    try {
      // Llamar a la función de autenticación (login o register)
      const { token } = await authFunction(username, password);

      // Guardar el JWT en localStorage
      saveToken(token);

      // Notificar a la pantalla que el login fue exitoso
      onLoginSuccess();

    } catch (error) {
      // Mostrar el error al usuario
      setServerError(error.message);
    } finally {
      // Siempre dejar de cargar, haya error o no
      setLoading(false);
    }
  };

  // FUNCIONES PÚBLICAS DEL HOOK
  /**
   * handleLogin()
   *
   * Inicia el flujo de autenticación con las credenciales actuales.
   * Valida el formulario, llama a la API y guarda el JWT.
   * Se conecta al botón "Iniciar Sesión" de la pantalla.
   */
  const handleLogin = () => {
    _handleAuthFlow((u, p) => login(u, p));
  };

  /**
   * handleRegister()
   *
   * Inicia el flujo de registro con las credenciales actuales.
   * Valida el formulario, llama a la API y guarda el JWT.
   * Se conecta al botón "Registrarse" de la pantalla.
   */
  const handleRegister = () => {
    _handleAuthFlow((u, p) => register(u, p));
  };

  // RETORNO DEL HOOK
  return {
    // Estado del formulario
    username,
    setUsername,
    password,
    setPassword,

    // Validación
    errors,
    isFormValid,
    buttonVariant,

    // Estado de la petición
    loading,
    serverError,

    // Acciones
    handleLogin,
    handleRegister,
  };
};