/**
 * ============================================================
 * UTILIDADES: mantEquipoUtils
 * ============================================================
 * 
 * Responsabilidad: Funciones puras de apoyo para formateo de datos,
 * generación de IDs y validaciones en el módulo de Mantenimiento de Equipos.
 * 
 * Datos:
 * - Recibe objetos ticket, equipo y tareas para procesar sus campos.
 * 
 * Validaciones:
 * - Formatea fechas cortas.
 * - Valida el costo de mano de obra.
 * - Genera IDs de ticket secuenciales.
 * 
 * Navegación:
 * - Ninguna.
 * 
 * Dependencias:
 * - shared/utils/dateUtils.js.
 */

import { formatDate } from "../../../shared/utils/dateUtils.js";

export function formatearFechaCorta(fecha) {
  if (!fecha) return "—";
  return formatDate(new Date(fecha));
}

export function generarNuevoId(tickets) {
  const nums = tickets.map((t) => parseInt(t.id.replace(/\D/g,""), 10)).filter((n) => !isNaN(n));
  return `A${String(nums.length > 0 ? Math.max(...nums) + 1 : 1).padStart(3,"0")}`;
}

/** Devuelve la fecha actual formateada como dd/mm/aaaa */
export function obtenerFechaHoraActual() {
  return formatDate(new Date());
}

/**
 * Valida que el costo de mano de obra sea un número >= 0.
 * @param {string} valor — valor del campo como string
 * @returns {boolean} true si es válido
 */
export function validarCostoManoObra(valor) {
  if (!valor || !String(valor).trim()) return false;
  const num = parseFloat(valor);
  return !isNaN(num) && num >= 0;
}

/**
 * Construye el string "Nombre Serie" de un equipo para el campo herramienta.
 * @param {object|null} equipo
 * @returns {string}
 */
export function formatearNombreHerramienta(equipo) {
  if (!equipo) return '';
  return `${equipo.nombre} ${equipo.serie}`;
}