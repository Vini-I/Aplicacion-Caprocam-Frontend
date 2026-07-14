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

if (!global.USUARIOS_REGISTRADOS) {
  global.USUARIOS_REGISTRADOS = [
    { username: 'login', password: 'Login1234', nombre: 'Admin', apellidos: 'Caprocam', email: 'admin@caprocam.com' }
  ];
}

/**
 * login(username, password)
 *
 * Busca el usuario en memoria global y valida su contraseña.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>}
 */
export const login = (username, password) => {
  const user = global.USUARIOS_REGISTRADOS.find(
    u => u.username.toLowerCase() === username.trim().toLowerCase()
  );
  
  if (!user || user.password !== password) {
    return Promise.reject(new Error('Usuario o contraseña incorrectos'));
  }
  
  return Promise.resolve({ token: 'mock-jwt-token-for-' + username });
};

/**
 * register(username, password, profileData)
 *
 * Registra un nuevo usuario en la memoria global si no existe ya.
 *
 * @param {string} username
 * @param {string} password
 * @param {Object} [profileData]
 * @returns {Promise<Object>}
 */
export const register = (username, password, profileData = {}) => {
  const { nombre, apellidos, email } = profileData;
  
  const emailExists = email && global.USUARIOS_REGISTRADOS.some(
    u => u.email && u.email.toLowerCase() === email.trim().toLowerCase()
  );
  
  if (emailExists) {
    return Promise.reject(new Error('El correo electrónico ya está registrado'));
  }
  
  const newUser = {
    username: username.trim(),
    password,
    nombre: nombre || '',
    apellidos: apellidos || '',
    email: email || ''
  };
  
  global.USUARIOS_REGISTRADOS.push(newUser);
  return Promise.resolve({ token: 'mock-jwt-token-for-' + username });
};