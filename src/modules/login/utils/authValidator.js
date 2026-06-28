/**
 * UTILIDAD: Validador del Formulario de Login Web
 *
 * Reglas de validación puras para login. Los errores se
 * calculan siempre, pero useAuth.js controla cuándo
 * mostrarlos (solo tras intentar enviar el formulario).
 */

import { AUTH_MESSAGES } from '../constants/authMessages';
import { validatePassword as validatePasswordRule } from './passwordValidator';

export const validateUsername = (username) => {
  if (!username || username.trim() === '') return AUTH_MESSAGES.ERROR_REQUIRED;
  return '';
};

export const validatePassword = (password) => {
  return validatePasswordRule(password, AUTH_MESSAGES);
};

export const validateAuthForm = (username, password) => ({
  username: validateUsername(username),
  password: validatePassword(password),
});

export const isAuthFormValid = (errors) =>
  errors.username === '' && errors.password === '';

export const getAuthButtonVariant = (isValid) =>
  isValid ? 'primary' : 'primary';