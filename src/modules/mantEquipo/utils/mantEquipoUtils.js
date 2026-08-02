/**
 * UTILIDADES: mantEquipoUtils
 * Funciones puras de apoyo para formateo de datos, generación de IDs
 * y filtrado de elementos en el módulo de Mantenimiento de Equipos.
 *
 * @dependencies - ESTADOS de mantEquipoService.js
 *               - TAREAS_DEMO de mantEquipoMensajes.js
 * @validations  - Formatea fechas cortas.
 *               - Determina etiquetas legibles y variantes de color según estado.
 *               - Construye cadenas formateadas con el detalle extendido de tareas.
 * @navigation   - N/A (utilidad pura).
 */

import { ESTADOS } from "../services/mantEquipoService.js";
import { formatDate } from "../../../shared/utils/dateUtils.js";

export function formatearFechaCorta(fecha) {
  if (!fecha) return "—";
  return formatDate(new Date(fecha));
}

export function etiquetaPorEstado(estado) {
  if (estado === ESTADOS.EN_ESPERA) return "En espera";
  if (estado === ESTADOS.EN_MANTENIMIENTO) return "En mantenimiento";
  if (estado === ESTADOS.TICKET_RESUELTO) return "Terminado";
  return estado;
}

export function variantePorEstado(estado) {
  if (estado === ESTADOS.EN_ESPERA) return "warning";
  if (estado === ESTADOS.EN_MANTENIMIENTO) return "info";
  if (estado === ESTADOS.TICKET_RESUELTO) return "success";
  return "info";
}

export function filtrarEquipos(equipos, texto) {
  if (!texto || !texto.trim()) return equipos;
  const q = texto.toLowerCase();
  return equipos.filter((e) =>
    (e.nombre || '').toLowerCase().includes(q) ||
    (e.codigo || '').toLowerCase().includes(q) ||
    (e.tipo || '').toLowerCase().includes(q) ||
    (e.descripcion || '').toLowerCase().includes(q)
  );
}

/**
 * Filtra tickets según texto y columna seleccionada.
 * Si no hay columna filtra en todas las propiedades string del ticket.
 */
export function filtrarTickets(tickets, texto, columna) {
  if (!texto || texto.trim().length < 1) return tickets;
  const q = texto.toLowerCase().trim();

  return tickets.filter((t) => {
    if (columna) {
      const val = String(t[columna] ?? "").toLowerCase();
      return val.includes(q);
    }
    // Sin columna: busca en todos los campos string y en tareas
    const coincideCampos = ["id", "herramienta", "descripcion", "titulo", "creadoPor", "estado"].some(
      (k) => String(t[k] ?? "").toLowerCase().includes(q)
    );
    if (coincideCampos) return true;

    // Buscar también coincidencia en el nombre de las tareas
    return Array.isArray(t.tareas) && t.tareas.some((tar) => {
      return (tar.nombre || tar.label || "").toLowerCase().includes(q);
    });
  });
}

/** Devuelve las etiquetas de las tareas de un ticket para mostrar en la tabla con su descripción y duración. */
export function etiquetasTareas(tareas) {
  if (!Array.isArray(tareas) || tareas.length === 0) return "—";
  return tareas.map((t) => {
    return t.nombre || t.label || "Tarea";
  }).join("\n");
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
  return `${equipo.nombre} ${equipo.codigo || equipo.id}`;
}
