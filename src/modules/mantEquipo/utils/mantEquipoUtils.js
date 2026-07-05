/**
 * UTILIDADES: mantEquipoUtils
 * Ruta: src/modules/mantEquipo/utils/mantEquipoUtils.js
 *
 * Funciones puras de apoyo para el módulo de mantenimiento de equipos.
 * No contienen estado ni efectos secundarios.
 */

import { ESTADOS } from "../services/mantEquipoService.js";

/**
 * Formatea una fecha para mostrarla en la tabla.
 * @param {Date|string|null} fecha - Fecha a formatear.
 * @returns {string} Texto como "Mar 12, 2024 03:55..." o "—" si no hay fecha.
 */
export function formatearFechaCorta(fecha) {
  if (!fecha) return "—";

  const d = new Date(fecha);
  const meses = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const horas   = String(d.getHours()).padStart(2, "0");
  const minutos = String(d.getMinutes()).padStart(2, "0");

  return `${meses[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${horas}:${minutos}...`;
}

/**
 * Devuelve la etiqueta legible de un estado de ticket.
 * @param {string} estado - Valor del estado (clave de ESTADOS).
 * @returns {string} Texto para mostrar al usuario.
 */
export function etiquetaPorEstado(estado) {
  if (estado === ESTADOS.EN_MANTENIMIENTO) return "En mantenimiento";
  if (estado === ESTADOS.FUERA_DE_SERVICIO) return "Fuera de servicio";
  return estado;
}

/**
 * Genera el siguiente ID de ticket en formato A### basándose en los tickets existentes.
 * @param {Array<{id: string}>} tickets - Lista actual de tickets.
 * @returns {string} Nuevo ID, p.ej. "A027".
 */
export function generarNuevoId(tickets) {
  const nums = tickets
    .map((t) => parseInt(t.id.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));

  const siguiente = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `A${String(siguiente).padStart(3, "0")}`;
}

/**
 * Filtra equipos por texto libre contra nombre, serie, tipo, marca y ubicación.
 * @param {Array<object>} equipos - Lista de equipos.
 * @param {string} texto - Texto de búsqueda del usuario.
 * @returns {Array<object>} Equipos que coinciden con el texto.
 */
export function filtrarEquipos(equipos, texto) {
  if (!texto || texto.trim() === "") return equipos;

  const q = texto.toLowerCase().trim();

  return equipos.filter(
    (e) =>
      e.nombre.toLowerCase().includes(q) ||
      e.serie.toLowerCase().includes(q)  ||
      e.tipo.toLowerCase().includes(q)   ||
      e.marca.toLowerCase().includes(q)  ||
      e.ubicacion.toLowerCase().includes(q)
  );
}
