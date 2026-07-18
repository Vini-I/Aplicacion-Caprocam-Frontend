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
