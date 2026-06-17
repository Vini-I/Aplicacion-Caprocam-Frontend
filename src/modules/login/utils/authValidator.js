/**
 * ============================================================
 * UTILIDAD: Validador del Formulario de Autenticación Web
 * ============================================================
 *
 * Funciones para validar el formulario de login web antes
 * de enviarlo a la API.
 *
 * - Usuario no puede estar vacío
 * - Contraseña: exactamente 8 caracteres
 * - Primer carácter debe ser mayúscula (A-Z)
 * - Debe contener al menos 4 dígitos numéricos
 *
 */

import { AUTH_MESSAGES } from '../constants/authMessages';

/**
 * validateUsername(username)
 *
 * Valida que el campo de usuario no esté vacío.
 *
 * @param {string} username
 * @returns {string} 
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return AUTH_MESSAGES.ERROR_USERNAME_REQUIRED;
  }
  return '';
};

/**
 * validatePassword(password)
 *
 * Valida que la contraseña cumpla las reglas del proyecto:
 * - Obligatoria (no vacía)
 * - Exactamente 8 caracteres
 * - El primer carácter debe ser una letra mayúscula (A-Z)
 * - Debe contener al menos 4 dígitos numéricos (0-9)
 *
 * @param {string} password 
 * @returns {string} 
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return AUTH_MESSAGES.ERROR_PASSWORD_REQUIRED;
  }

  if (password.length !== 8) {
    return AUTH_MESSAGES.ERROR_PASSWORD_LENGTH;
  }

  // Verificar que el primer carácter sea una letra mayúscula
  const startsWithUppercase = /^[A-Z]/.test(password);
  if (!startsWithUppercase) {
    return AUTH_MESSAGES.ERROR_PASSWORD_UPPERCASE;
  }

  // Verificar que contenga al menos 4 dígitos numéricos
  const digitCount = (password.match(/\d/g) || []).length;
  if (digitCount < 4) {
    return AUTH_MESSAGES.ERROR_PASSWORD_NUMERIC;
  }

  return '';
};

/**
 * validateAuthForm(username, password)
 *
 * Valida todos los campos del formulario de login web.
 * @param {string} username 
 * @param {string} password 
 * @returns {Object} 
 */
export const validateAuthForm = (username, password) => {
  return {
    username: validateUsername(username),
    password: validatePassword(password),
  };
};

/**
 * isAuthFormValid(errors)
 *
 * Determina si el formulario no tiene ningún error.
 *
 * @param {Object} errors 
 * @returns {boolean} 
 */
export const isAuthFormValid = (errors) => {
  return errors.username === '' && errors.password === '';
};

/**
 * getAuthButtonVariant(isValid)
 *
 * Retorna la variante visual del botón según el estado del formulario.
 *
 * @param {boolean} isValid 
 * @returns {string} 
 */
export const getAuthButtonVariant = (isValid) => {
  return isValid ? 'primary' : 'secondary';
};
