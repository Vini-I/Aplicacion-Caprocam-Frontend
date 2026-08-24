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
const REFRESH_TOKEN_KEY = 'caprocam_refresh_token';

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
    throw new Error('No se pudo guardar la sesión. Verifica el almacenamiento del navegador.');
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
  } catch {
    return null;
  }
};

export const saveUsuario = (user) => {
  try {
    if (user) localStorage.setItem(USUARIO_KEY, JSON.stringify(user));
  } catch (error) {
    throw new Error('No se pudo guardar los datos del usuario en la sesión.');
  }
};

export const getUsuario = () => {
  try {
    const data = localStorage.getItem(USUARIO_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Decodifica el payload (segunda parte) del JWT almacenado.
 * Retorna el objeto con los claims del token (id, grupoDatos, accesoGlobal, etc.).
 * No verifica la firma — eso lo hace el backend.
 *
 * @returns {Object|null}
 */
export const getTokenPayload = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Guarda el Refresh Token en localStorage.
 * Se llama después de un login exitoso.
 *
 * @param {string} refreshToken
 * @returns {void}
 */
export const saveRefreshToken = (refreshToken) => {
  try {
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    throw new Error('No se pudo guardar el token de sesión extendida.');
  }
};

/**
 * Lee el Refresh Token guardado en localStorage.
 * Retorna null si no existe.
 *
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
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
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    throw new Error('No se pudo cerrar la sesión correctamente. Intenta de nuevo.');
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