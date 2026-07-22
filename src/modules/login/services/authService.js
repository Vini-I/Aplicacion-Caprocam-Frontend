/**
 * ============================================================
 * SERVICIO: authService
 * ============================================================
 * 
 * Responsabilidad: Simulación de consultas y persistencia en memoria
 * para la autenticación y registro de usuarios en el módulo de Login.
 * 
 * DATOS:
 * - USUARIOS_REGISTRADOS: Array mutable que almacena los usuarios del sistema.
 * 
 * VALIDACIONES:
 * - Verifica si un nombre de usuario ya está registrado al momento del registro.
 * - Compara nombre de usuario y contraseña para autorizar el inicio de sesión.
 * 
 * NAVEGACIÓN:
 * - Ninguna.
 * 
 * DEPENDENCIAS:
 * - Ninguna.
 */

import { AUTH_MESSAGES } from '../constants/authMessages';
import { postAuth } from './httpAuthClient';

if (!global.USUARIOS_REGISTRADOS) {
  global.USUARIOS_REGISTRADOS = [
    { username: 'login', password: 'Login1234', nombre: 'Admin', apellidos: 'Caprocam', email: 'admin@caprocam.com' }
  ];
}

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

  if (!user || user.password !== password) {
    return Promise.reject(new Error('Usuario o contraseña incorrectos'));
  }

  return Promise.resolve({ token: 'mock-jwt-token-for-' + username });
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