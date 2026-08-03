/**
 * UTILIDAD: dateFormatter
 * Formatea fechas a cadenas de texto legibles en español (es-AR) con capitalización adecuada.
 *
 * @dependencies - Ninguna
 * @validations  - Formatea objeto Date válido o usa la fecha actual por defecto.
 * @navigation   - Ninguna
 */

/**
 * Formatea una fecha al formato: "Lunes, 9 de junio de 2026"
 * Con locale español de Argentina.
 *
 * @param {Date} date - La fecha a formatear (default: hoy)
 * @returns {string} Fecha formateada con primera letra mayúscula
 *
 * Ejemplo:
 * formatDateInSpanish(new Date()) // "Lunes, 9 de junio de 2026"
 */
export const formatDateInSpanish = (date = new Date()) => {
  const rawDate = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  // Capitalizar primera letra de cada palabra
  return rawDate.replace(/(^\w|\s\w)/g, (match) => {
    return match.trim() === 'd' ? match : match.toUpperCase();
  });
};
