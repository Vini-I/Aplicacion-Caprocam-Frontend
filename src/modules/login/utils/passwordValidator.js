/**
 * ============================================================
 * UTILIDAD: Validador de Contraseña (compartido)
 * ============================================================
 *
 * Regla única de contraseña, reutilizada por authValidator.js
 * (login) y registerValidator.js (registro), ya que ambas
 * pantallas exigen exactamente la misma política:
 * - Obligatoria
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos 4 dígitos numéricos
 *
 * Recibe el objeto de mensajes (AUTH_MESSAGES o REGISTER_MESSAGES)
 * como parámetro, ya que ambos exponen las mismas llaves de
 * error de contraseña (ERROR_PASSWORD_*).
 */

/**
 * validatePassword(password, messages)
 *
 * @param {string} password
 * @param {Object} messages - AUTH_MESSAGES o REGISTER_MESSAGES
 * @returns {string} mensaje de error, o '' si es válida
 */
export const validatePassword = (password, messages) => {
  if (!password || password.trim() === '') {
    return messages.ERROR_PASSWORD_REQUIRED;
  }

  if (password.length < 8) {
    return messages.ERROR_PASSWORD_LENGTH;
  }

  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    return messages.ERROR_PASSWORD_UPPERCASE;
  }

  const digitCount = (password.match(/\d/g) || []).length;
  if (digitCount < 4) {
    return messages.ERROR_PASSWORD_NUMERIC;
  }

  return '';
};