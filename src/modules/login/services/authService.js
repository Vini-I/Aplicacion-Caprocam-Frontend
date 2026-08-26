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

import { AUTH_MESSAGES } from "../constants/authMessages";
import { postAuth } from "./httpAuthClient";
import api from "../../../api/api";
import { getRefreshToken } from "../utils/tokenStorage";

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
    "/login",
    { usuario: username.trim(), contrasena: password },
    { 401: AUTH_MESSAGES.ERROR_INVALID_CREDENTIALS },
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
  const { nombre, apellidos, email, grupoDatos } = profileData;

  const payload = {
    nombre: nombre || "",

    apellidos: apellidos || "",

    correo: email || "",

    usuario: username.trim(),

    contrasena: password,

    rolId: 1,
  };

  if (
    grupoDatos !== undefined &&
    grupoDatos !== null &&
    String(grupoDatos).trim() !== ""
  ) {
    payload.grupoDatos = Number(grupoDatos);
  }

  return postAuth("/login/registro", payload);
};

/**
 * logout()
 *
 * Invalida el refresh token en el backend (POST /login/logout)
 * y limpia la sesión local. Si el backend falla, la limpieza
 * local se hace de todas formas para garantizar el cierre de sesión.
 *
 * @returns {Promise<void>}
 */
export const logout = async () => {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await api.post("/login/logout", { refreshToken });
    } catch {
      // El token ya pudo haber expirado en el backend; ignoramos el error
      // para que el cierre de sesión local siempre proceda.
    }
  }
};
