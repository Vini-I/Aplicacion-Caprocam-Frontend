/**
 * UTILIDAD: tokenStorage
 * Gestiona el almacenamiento, lectura y eliminación del token JWT y objeto de usuario en localStorage.
 *
 * @dependencies - localStorage (Browser API)
 * @validations  - Manejo seguro de excepciones try/catch para lectura y escritura.
 * @navigation   - Ninguna
 */

// Clave utilizada para guardar el token en localStorage
const TOKEN_KEY = 'caprocam_auth_token';
const USUARIO_KEY = 'caprocam_usuario';

/**
 * Guarda el JWT en localStorage.
 * Se llama después de un login exitoso.
 *
 * @param {string} token 
 * @returns {void}
 *
 */
export const saveToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('[tokenStorage] Error al guardar el token:', error);
  }
};

/**
 * Lee el JWT guardado en localStorage.
 * Retorna null si no hay token almacenado.
 *
 * @returns {string|null}
 *
 * }
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('[tokenStorage] Error al leer el token:', error);
    return null;
  }
};

export const saveUsuario = (user) => {
  try {
    if (user) localStorage.setItem(USUARIO_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('[tokenStorage] Error al guardar usuario:', error);
  }
};

export const getUsuario = () => {
  try {
    const data = localStorage.getItem(USUARIO_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Elimina el JWT de localStorage.
 * Se llama cuando el usuario cierra sesión (logout).
 *
 * @returns {void}
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
  } catch (error) {
    console.error('[tokenStorage] Error al eliminar el token:', error);
  }
};

/**
 * hasToken()
 *
 * Verifica si existe un token guardado (sesión activa).
 * Útil para decidir si redirigir al usuario al home
 * o mostrarle el login.
 *
 * @returns {boolean} 
 *
 */
export const hasToken = () => {
  return getToken() !== null;
};