/**
 * ============================================================
 * dateUtils.js
 * ============================================================
 *
 * Descripción:
 * Utilidades centralizadas para trabajar con fechas en formato
 * de texto "dd/mm/aaaa", el formato estándar usado en formularios
 * y componentes de fecha de la app (por ejemplo DateInput).
 * Evita que cada módulo escriba su propio parseo de fecha.
 *
 * Cómo utilizarlo:
 * Importar solo las funciones necesarias desde este archivo.
 * No duplicar esta lógica de parseo/formateo en hooks o
 * componentes de módulos individuales.
 *
 * Restricciones:
 * - Todas las funciones asumen el formato de texto "dd/mm/aaaa".
 * - parseDate no lanza errores; si el texto es inválido retorna null,
 *   quien la use debe manejar ese caso.
 * - parseDate rechaza fechas que no existen en el calendario (ej. 31/02/2026)
 *   y fechas con día/mes fuera de rango (día 1-31, mes 1-12).
 * - No depender de zona horaria del servidor; las fechas se arman
 *   con año/mes/día locales (new Date(anio, mes, dia)).
 *
 * Ejemplos de uso:
 * import { parseDate, formatDate, esFechaFutura, esFechaValida } from "../../../shared/utils/dateUtils";
 *
 * const fecha = parseDate("07/07/2026");      // Date | null
 * const texto = formatDate(new Date());       // "07/07/2026"
 * const futura = esFechaFutura("31/12/2026"); // true | false
 * const valida = esFechaValida("31/02/2026"); // false
 */

export function parseDate(fechaTexto) {
  if (!fechaTexto) {
    return null;
  }

  const partes = fechaTexto.split("/");

  if (partes.length !== 3) {
    return null;
  }

  const dia = Number(partes[0]);
  const mesTexto = Number(partes[1]);
  const anio = Number(partes[2]);

  if (
    !Number.isInteger(dia) ||
    !Number.isInteger(mesTexto) ||
    !Number.isInteger(anio)
  ) {
    return null;
  }

  if (mesTexto < 1 || mesTexto > 12) {
    return null;
  }

  if (dia < 1 || dia > 31) {
    return null;
  }

  const mes = mesTexto - 1;
  const fecha = new Date(anio, mes, dia);

  if (Number.isNaN(fecha.getTime())) {
    return null;
  }

  // Detecta fechas que "se corrieron" de mes, ej. 31/02/2026 -> 03/03/2026
  if (fecha.getDate() !== dia || fecha.getMonth() !== mes) {
    return null;
  }

  return fecha;
}

export function esFechaValida(fechaTexto) {
  return parseDate(fechaTexto) !== null;
}

export function formatDate(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

export function esFechaFutura(fechaTexto) {
  const fecha = parseDate(fechaTexto);

  if (!fecha) {
    return false;
  }

  const hoy = new Date();
  hoy.setHours(23, 59, 59, 999);

  return fecha.getTime() > hoy.getTime();
}