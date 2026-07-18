/**
 * ============================================================
 * UTILIDADES: mantEquipoUtils
 * ============================================================
 * 
 * Responsabilidad: Funciones puras de apoyo para formateo de datos,
 * generación de IDs y filtrado de elementos en el módulo de
 * Mantenimiento de Equipos.
 * 
 * Datos:
 * - Recibe objetos ticket, equipo y tareas para procesar sus campos.
 * 
 * Validaciones:
 * - Formatea fechas cortas.
 * - Determina las etiquetas legibles y variantes de color según el estado.
 * - Construye cadenas formateadas con el detalle extendido de tareas.
 * 
 * Navegación:
 * - Ninguna.
 * 
 * Dependencias:
 * - ESTADOS de mantEquipoService.js.
 * - TAREAS_DEMO de mantEquipoMensajes.js.
 */

import { ESTADOS } from "../services/mantEquipoService.js";
import { TAREAS_DEMO } from "../services/tareasService.js";
import { formatDate } from "../../../shared/utils/dateUtils.js";

export function formatearFechaCorta(fecha) {
  if (!fecha) return "—";
  return formatDate(new Date(fecha));
}

export function etiquetaPorEstado(estado) {
  if (estado === ESTADOS.EN_ESPERA)        return "En espera";
  if (estado === ESTADOS.EN_MANTENIMIENTO) return "En mantenimiento";
  if (estado === ESTADOS.TICKET_RESUELTO)  return "Terminado";
  return estado;
}

export function variantePorEstado(estado) {
  if (estado === ESTADOS.EN_ESPERA)        return "warning";
  if (estado === ESTADOS.EN_MANTENIMIENTO) return "info";
  if (estado === ESTADOS.TICKET_RESUELTO)   return "success";
  return "info";
}

export function generarNuevoId(tickets) {
  const nums = tickets.map((t) => parseInt(t.id.replace(/\D/g,""), 10)).filter((n) => !isNaN(n));
  return `A${String(nums.length > 0 ? Math.max(...nums) + 1 : 1).padStart(3,"0")}`;
}

export function filtrarEquipos(equipos, texto) {
  if (!texto || !texto.trim()) return equipos;
  const q = texto.toLowerCase();
  return equipos.filter((e) =>
    e.nombre.toLowerCase().includes(q) || e.serie.toLowerCase().includes(q) ||
    e.tipo.toLowerCase().includes(q)   || e.marca.toLowerCase().includes(q) ||
    e.ubicacion.toLowerCase().includes(q)
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
    const coincideCampos = ["id","herramienta","descripcion","titulo","creadoPor","estado"].some(
      (k) => String(t[k] ?? "").toLowerCase().includes(q)
    );
    if (coincideCampos) return true;
    
    // Buscar también coincidencia en el nombre o descripción de las tareas
    return Array.isArray(t.tareas) && t.tareas.some((tar) => {
      const fullTask = TAREAS_DEMO.find((d) => d.value === tar.value) || tar;
      return (fullTask.nombre || fullTask.label || "").toLowerCase().includes(q) ||
             (fullTask.descripcion || "").toLowerCase().includes(q);
    });
  });
}

/** Devuelve las etiquetas de las tareas de un ticket para mostrar en la tabla con su descripción y duración. */
export function etiquetasTareas(tareas) {
  if (!Array.isArray(tareas) || tareas.length === 0) return "—";
  return tareas.map((t) => {
    const fullTask = TAREAS_DEMO.find((d) => d.value === t.value) || t;
    const desc = fullTask.descripcion ? `: ${fullTask.descripcion}` : "";
    const hrs = fullTask.duracionEstimada ? ` (${fullTask.duracionEstimada} hrs)` : "";
    return `${fullTask.nombre || fullTask.label}${desc}${hrs}`;
  }).join("\n");
}

/** Devuelve la fecha actual formateada como dd/mm/aaaa */
export function obtenerFechaHoraActual() {
  return formatDate(new Date());
}
