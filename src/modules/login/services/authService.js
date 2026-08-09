/**
 * SERVICIO: authService
 *
 * Expone las funciones de autenticación (login) y registro (register)
 * utilizando el cliente HTTP centralizado.
 *
 * @dependencies - postAuth de httpAuthClient
 *               - AUTH_MESSAGES de constants/authMessages
 * @validations  - Envío y mapeo de datos de usuario y administrador.
 * @navigation   - N/A (servicio de autenticación).
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
 * @throws {Error}
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
 * Envía nombre, apellidos, correo, usuario, contraseña y rolId
 * al endpoint POST /login/registro.
 *
 * @param {string} username
 * @param {string} password
 * @param {Object} [profileData]
 * @returns {Promise<Object>}
 * @throws {Error}
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