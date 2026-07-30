/**
 * ============================================================
 * UTILIDADES JWT
 * ============================================================
 *
 * Utilidades para decodificar tokens JWT y obtener
 * información de su payload, especialmente la fecha
 * de expiración.
 *
 * Funcionalidad:
 * - Decodifica un token JWT y retorna su payload.
 * - Obtiene la fecha de expiración de un token en milisegundos.
 *
 * Props principales:
 * - token: String con el token JWT a decodificar.
 *
 * Ejemplo:
 * const exp = getTokenExpiration(token);
 * if (exp && exp < Date.now()) { // token expirado }
 * ============================================================
 */

// src/shared/utils/jwtUtils.js

/**
 * Decodifica un token JWT y retorna su payload.
 * @param {string} token - Token JWT a decodificar.
 * @returns {Object|null} Payload del token o null si falla.
 */
export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Obtiene la fecha de expiración de un token JWT.
 * @param {string} token - Token JWT.
 * @returns {number|null} Timestamp de expiración en milisegundos o null.
 */
export function getTokenExpiration(token) {
  const decoded = decodeToken(token);
  return decoded && decoded.exp ? decoded.exp * 1000 : null;
}