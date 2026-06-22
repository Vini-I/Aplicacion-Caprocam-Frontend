/**
 * ============================================================
 * AUTH SERVICE
 * ============================================================
 *
 * Autentica y registra usuarios mediante JSON Web Tokens (JWT).
 * Usa httpAuthClient.js para no duplicar el manejo de errores
 * de red/estatus entre login() y register().
 */

import { AUTH_MESSAGES } from '../constants/authMessages';
import { postAuth } from './httpAuthClient';

/**
 * login(username, password)
 *
 * Envía las credenciales al backend y retorna el JWT si son
 * correctas.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const login = (username, password) => {
  return postAuth(
    '/api/auth/login',
    { username: username.trim(), password },
    { 401: AUTH_MESSAGES.ERROR_INVALID_CREDENTIALS }
  );
};

/**
 * register(username, password, profileData)
 *
 * Registra un nuevo usuario en el sistema.
 *
 * NOTA DE BACKEND PENDIENTE: la pantalla de registro
 * (WebRegisterScreen) captura nombre, apellidos y correo
 * electrónico además de usuario/contraseña. El endpoint
 * POST /api/auth/register hoy solo acepta { username, password }.
 *
 * // TODO: Integrar con backend ampliado — una vez que el
 * // endpoint acepte nombre, apellidos y email, agregarlos
 * // al body de abajo y quitar este comentario.
 *
 * @param {string} username
 * @param {string} password
 * @param {Object} [profileData] 
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const register = (username, password, profileData = {}) => {
  // eslint-disable-next-line no-unused-vars
  const { nombre, apellidos, email } = profileData; // pendiente de backend, ver TODO arriba

  return postAuth('/api/auth/register', {
    username: username.trim(),
    password,
    // nombre, apellidos, email: pendientes de soporte en el backend
  });
};