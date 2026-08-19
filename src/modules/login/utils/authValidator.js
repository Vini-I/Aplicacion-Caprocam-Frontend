/**
 * ============================================================
 * UTILIDAD: authValidator
 * ============================================================
 *
 * Reglas de validación pura para el formulario de login web.
 * Valida username y password y agrupa el resultado en un objeto
 * de errores para su uso por useAuth.
 *
 * @dependencies - AUTH_MESSAGES de constants/authMessages
 * @validations  - username y password no pueden estar vacíos (ERROR_REQUIRED).
 *               - Las funciones son puras: sin efectos secundarios.
 *               - getAuthButtonVariant fue eliminada (ambas ramas = 'primary').
 * @navigation   - N/A (utilidad pura).
 */

import { AUTH_MESSAGES } from '../constants/authMessages';

export const validateUsername = (username) => {
  if (!username || username.trim() === '') return AUTH_MESSAGES.ERROR_REQUIRED;
  return '';
};

export const validatePassword = (password) => {
  if (!password || password.trim() === '') return AUTH_MESSAGES.ERROR_REQUIRED;
  return '';
};

export const validateAuthForm = (username, password) => ({
  username: validateUsername(username),
  password: validatePassword(password),
});

export const isAuthFormValid = (errors) =>
  errors.username === '' && errors.password === '';