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
 * Envía las credenciales al backend y retorna el JWT si son correctas.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>}
 */
export const login = (username, password) => {
  return postAuth(
    '/login',
    { usuario: username.trim(), contrasena: password },
    { 401: AUTH_MESSAGES.ERROR_INVALID_CREDENTIALS }
  );
};

/**
 * register(username, password, profileData)
 *
 * Registra un nuevo administrador en el sistema.
 *
 * @param {string} username
 * @param {string} password
 * @param {Object} [profileData] 
 * @returns {Promise<Object>}
 */
export const register = (username, password, profileData = {}) => {
  const { nombre, apellidos, email } = profileData;

  return postAuth('/login/registro', {
    nombre: nombre || '',
    apellidos: apellidos || '',
    correo: email || '',
    usuario: username.trim(),
    contrasena: password,
    rolId: 1
  });
};