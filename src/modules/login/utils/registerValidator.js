/**
 * UTILIDAD: Validador del Formulario de Registro Web
 *
 * Reglas de validación puras para registro. Los errores se
 * calculan siempre, pero useRegister.js controla cuándo
 * mostrarlos (solo tras intentar enviar el formulario).
 *
 * Campos simples (nombre, apellidos, username, email vacío)
 * usan el mensaje consolidado ERROR_REQUIRED. El correo con
 * formato inválido y la contraseña mantienen mensajes detallados.
 */

import { AUTH_MESSAGES } from '../constants/authMessages';
import { validatePassword as validatePasswordRule } from './passwordValidator';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateNombre    = (v) => (!v || !v.trim() ? AUTH_MESSAGES.ERROR_REQUIRED : '');
export const validateApellidos = (v) => (!v || !v.trim() ? AUTH_MESSAGES.ERROR_REQUIRED : '');
export const validateUsername  = (v) => (!v || !v.trim() ? AUTH_MESSAGES.ERROR_REQUIRED : '');

export const validateEmail = (email) => {
  if (!email || !email.trim()) return AUTH_MESSAGES.ERROR_REQUIRED;
  if (!EMAIL_REGEX.test(email.trim())) return AUTH_MESSAGES.ERROR_EMAIL_INVALID;
  return '';
};

export const validatePassword = (password) =>
  validatePasswordRule(password, AUTH_MESSAGES);

export const validateRegisterForm = ({ nombre, apellidos, email, username, password }) => ({
  nombre:    validateNombre(nombre),
  apellidos: validateApellidos(apellidos),
  email:     validateEmail(email),
  username:  validateUsername(username),
  password:  validatePassword(password),
});

export const isRegisterFormValid = (errors) =>
  Object.values(errors).every((e) => e === '');

export const getRegisterButtonVariant = () => 'primary';