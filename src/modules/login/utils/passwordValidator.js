/**
 * UTILIDAD: passwordValidator
 * Regla única de validación de contraseña compartida entre login y registro.
 *
 * @dependencies - Objeto de mensajes (AUTH_MESSAGES o REGISTER_MESSAGES)
 * @validations  - Mínimo 8 caracteres, mayúscula, minúscula, dígito y carácter especial.
 * @navigation   - N/A (utilidad pura).
 */

/**
 * validatePassword(password, messages)
 *
 * Validaciones según regex del backend:
 * /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-#])[A-Za-z\d@$!%*?&._\-#]{8,}$/
 *
 * @param {string} password
 * @param {Object} messages - AUTH_MESSAGES
 * @returns {string} mensaje de error, o '' si es válida
 */
export const validatePassword = (password, messages) => {
  if (!password || password.trim() === '') {
    return messages.ERROR_PASSWORD_REQUIRED;
  }

  if (password.length < 8) {
    return messages.ERROR_PASSWORD_LENGTH;
  }

  if (!/[A-Z]/.test(password)) {
    return messages.ERROR_PASSWORD_UPPERCASE;
  }

  if (!/[a-z]/.test(password)) {
    return messages.ERROR_PASSWORD_LOWERCASE;
  }

  if (!/\d/.test(password)) {
    return messages.ERROR_PASSWORD_DIGIT;
  }

  if (!/[@$!%*?&._\-#]/.test(password)) {
    return messages.ERROR_PASSWORD_SYMBOL;
  }

  return '';
};