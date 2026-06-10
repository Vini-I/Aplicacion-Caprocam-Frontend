/**
 * ============================================================
 * UTILIDAD: Validador de Formulario de Login
 * ============================================================
 *
 * Funciones para validar el estado del formulario de login.
 * Centraliza la lógica de validación en un lugar.
 */

/**
 * Obtiene el mensaje de validación según lo que falta seleccionar
 *
 * @param {boolean} hasShift - ¿Usuario seleccionó turno?
 * @param {boolean} hasWorker - ¿Usuario seleccionó trabajador?
 * @returns {string} Mensaje apropiado o vacío si todo está completo
 *
 * Ejemplo:
 * getLoginValidationMessage(false, false) // "Selecciona un turno y tu nombre"
 * getLoginValidationMessage(true, false)  // "Selecciona tu nombre"
 * getLoginValidationMessage(true, true)   // ""
 */
export const getLoginValidationMessage = (hasShift, hasWorker) => {
  if (!hasShift && !hasWorker) {
    return 'Selecciona un turno y tu nombre';
  }
  if (!hasShift) {
    return 'Selecciona un turno';
  }
  if (!hasWorker) {
    return 'Selecciona tu nombre';
  }
  return '';
};

/**
 * Determina si el formulario es válido para enviar
 *
 * @param {boolean} hasShift - ¿Usuario seleccionó turno?
 * @param {boolean} hasWorker - ¿Usuario seleccionó trabajador?
 * @returns {boolean} true si ambos están seleccionados
 *
 * Ejemplo:
 * isLoginFormValid(true, true)   // true
 * isLoginFormValid(true, false)  // false
 */
export const isLoginFormValid = (hasShift, hasWorker) => {
  return hasShift && hasWorker;
};

/**
 * Obtiene el tipo de botón según el estado de validación
 *
 * @param {boolean} isValid - ¿Es válido el formulario?
 * @returns {string} 'primary' si es válido, 'secondary' si no
 *
 * Ejemplo:
 * getButtonType(true)  // "primary"
 * getButtonType(false) // "secondary"
 */
export const getButtonType = (isValid) => {
  return isValid ? 'primary' : 'secondary';
};
