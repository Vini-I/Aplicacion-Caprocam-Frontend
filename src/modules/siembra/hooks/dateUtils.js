/**
 * ============================================================
 * UTILIDADES DE FECHA - MÓDULO SIEMBRA
 * ============================================================
 *
 * Punto único dentro del módulo de Siembra para construir/formatear
 * fechas en el formato del estándar del proyecto: dd/mm/aaaa (ver
 * estándar de fechas, sección 1.6 del documento de estandarización).
 *
 * FUNCIONALIDAD:
 * - formatearFecha: convierte un objeto Date a "dd/mm/aaaa".
 * - obtenerFechaHoy: devuelve la fecha actual ya formateada.
 * - formatearFechaDesdeISO: convierte una fecha ISO (la que devuelve
 *   el backend, ej. "2026-07-21T06:00:00.000Z") al formato del
 *   estándar del proyecto. Necesaria porque las columnas DATE de
 *   MySQL llegan como datetime completo en formato ISO, no como
 *   dd/mm/aaaa - sin esta conversión, la fecha se muestra cruda en
 *   pantalla en vez de en el formato esperado.
 *
 * REGLA:
 * Ningún archivo del módulo debe construir manualmente strings de
 * fecha (day/month/year + padStart) ni usar regex propios para
 * fechas. Todo eso debe pasar por este archivo, junto con DateInput.
 */

export function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

export function obtenerFechaHoy() {
  return formatearFecha(new Date());
}

// Convierte fechas que vienen del backend (formato ISO) al estándar
// dd/mm/aaaa del proyecto. Es la conversión inversa a la que hace
// siembra.dto.js (aFechaISO) al enviar datos al backend.
export function formatearFechaDesdeISO(fechaISO) {
  if (!fechaISO) return "";
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) return "";
  return formatearFecha(fecha);
}