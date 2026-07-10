/**
 * ============================================================
 * UTILIDAD: authValidator
 * ============================================================
 * 
 * Responsabilidad: Reglas de validación pura para el formulario de Login.
 * 
 * FUNCIONALIDAD:
 * - Valida si el usuario y la contraseña no están vacíos.
 * 
 * VALIDACIONES:
 * - Campo obligatorio (ERROR_REQUIRED) para ambos inputs.
 * 
 * DEPENDENCIAS:
 * - authMessages.js
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

export const getAuthButtonVariant = (isValid) =>
  isValid ? 'primary' : 'primary';