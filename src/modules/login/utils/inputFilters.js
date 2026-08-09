/**
 * UTILIDAD: inputFilters
 *
 * Filtros de caracteres aplicados en tiempo real (onChangeText) para
 * evitar el ingreso de caracteres no permitidos en el formulario de registro.
 *
 * @dependencies - Ninguna.
 * @validations  - Nombre/apellidos: solo letras, tildes, diéresis, ñ, apóstrofe y espacios.
 *               - Username: solo letras, números y guion bajo.
 * @navigation   - N/A (utilidad pura).
 */

/**
 * filterNameChars(value)
 * Permite: letras, tildes (á é í ó ú Á É Í Ó Ú), diéresis (ü Ü),
 * la letra ñ/Ñ, apóstrofe y espacio (para nombres/apellidos compuestos).
 */
export const filterNameChars = (value = '') =>
  value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ' ]/g, '');

/**
 * filterUsernameChars(value)
 * Permite: letras, números y guion bajo.
 */
export const filterUsernameChars = (value = '') =>
  value.replace(/[^a-zA-Z0-9_]/g, '');