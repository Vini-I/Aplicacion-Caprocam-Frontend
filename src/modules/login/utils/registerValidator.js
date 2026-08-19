/**
 * UTILIDAD: registerValidator
 *
 * Reglas de validación puras para el formulario de registro de administradores web.
 *
 * @dependencies - AUTH_MESSAGES de constants/authMessages.
 * @validations  - Obligatoriedad en nombre, apellidos, username, email y password.
 *               - Formato de correo válido (@ + dominio + .com).
 *               - Complejidad y duplicados delegados al backend (serverError).
 * @navigation   - N/A (utilidad pura).
 */

import { AUTH_MESSAGES } from '../constants/authMessages';
import { validatePassword as validatePasswordRule } from './passwordValidator';

// Exige @, un dominio y que termine en .com (ej: nombre@dominio.com)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.com$/i;

// Exactamente 3 dígitos (últimos 3 dígitos del CBO)
const GRUPO_DATOS_REGEX = /^\d{3}$/;

export const validateNombre    = (v) => (!v || !v.trim() ? AUTH_MESSAGES.ERROR_REQUIRED : '');
export const validateApellidos = (v) => (!v || !v.trim() ? AUTH_MESSAGES.ERROR_REQUIRED : '');
export const validateUsername  = (v) => (!v || !v.trim() ? AUTH_MESSAGES.ERROR_REQUIRED : '');

export const validateEmail = (email) => {
  if (!email || !email.trim()) return AUTH_MESSAGES.ERROR_REQUIRED;
  if (!EMAIL_REGEX.test(email.trim())) return AUTH_MESSAGES.ERROR_EMAIL_INVALID;
  return '';
};

export const validatePassword = (v) =>
  validatePasswordRule(v, AUTH_MESSAGES);

export const validateGrupoDatos = (v, esGlobal) => {
  if (!esGlobal) return '';
  if (!v || !String(v).trim()) return AUTH_MESSAGES.ERROR_REQUIRED;
  if (!GRUPO_DATOS_REGEX.test(String(v).trim())) return AUTH_MESSAGES.ERROR_GRUPO_DATOS_INVALID;
  return '';
};

export const validateRegisterForm = ({ nombre, apellidos, email, username, password, grupoDatos, esGlobal }) => ({
  nombre:    validateNombre(nombre),
  apellidos: validateApellidos(apellidos),
  email:     validateEmail(email),
  username:  validateUsername(username),
  password:  validatePassword(password),
  grupoDatos: validateGrupoDatos(grupoDatos, esGlobal),
});

export const isRegisterFormValid = (errors) =>
  Object.values(errors).every((e) => e === '');

export const getRegisterButtonVariant = () => 'primary';

const FIELD_ORDER = ['nombre', 'apellidos', 'email', 'username', 'grupoDatos', 'password'];

const isEmptyError = (err) =>
  err === AUTH_MESSAGES.ERROR_REQUIRED || err === AUTH_MESSAGES.ERROR_PASSWORD_REQUIRED;

export const getRegisterValidationResult = (errors) => {
  const hasEmptyField = FIELD_ORDER.some((key) => isEmptyError(errors[key]));

  if (hasEmptyField) {
    const fieldsToHighlight = FIELD_ORDER.filter((key) => errors[key] !== '');
    return {
      mode: 'generic',
      message: 'Revisa los campos obligatorios marcados con * antes de registrarte.',
      fieldsToHighlight,
    };
  }

  const firstErrorField = FIELD_ORDER.find((key) => errors[key] !== '');

  if (firstErrorField) {
    return {
      mode: 'specific',
      message: errors[firstErrorField],
      fieldsToHighlight: [firstErrorField],
    };
  }

  return {
    mode: 'none',
    message: '',
    fieldsToHighlight: [],
  };
};