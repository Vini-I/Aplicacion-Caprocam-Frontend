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
 * @param {boolean} hasWorker - ¿Usuario seleccionó trabajador?
 * @returns {string} Mensaje apropiado o vacío si todo está completo
 *
 * Ejemplo:
 * getLoginValidationMessage(false) // "Selecciona tu nombre"
 * getLoginValidationMessage(true)  // ""
 */
export const getLoginValidationMessage = (hasWorker) => {
  if (!hasWorker) {
    return 'Selecciona tu nombre';
  }
  return '';
};

/**
 * Determina si el formulario es válido para enviar
 *
 * @param {boolean} hasWorker - ¿Usuario seleccionó trabajador?
 * @returns {boolean} true si el trabajador está seleccionado
 *
 * Ejemplo:
 * isLoginFormValid(true)   // true
 * isLoginFormValid(false)  // false
 */
export const isLoginFormValid = (hasWorker) => {
  return hasWorker;
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
