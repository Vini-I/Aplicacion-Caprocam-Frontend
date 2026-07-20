/**
 * ============================================================
 * SERVICIO: registrarEquipoService
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Expone catálogos y el payload normalizado para el formulario
 * de registro de equipos, y conecta con equiposService para
 * persistir contra la API real.
 * ============================================================
 */

import { equiposService } from './equiposService';

// NOTA: se quitaron 'Mantenimiento' y 'Otro' porque el backend
// (TipoEquipo en equipo.dto.js) todavía no los soporta.
export const TIPOS_EQUIPO = [
  { label: 'Aireación', value: 'aireacion' },
  { label: 'Bombeo', value: 'bombeo' },
  { label: 'Alimentación', value: 'alimentacion' },
  { label: 'Monitoreo', value: 'monitoreo' },
];

export const ESTADOS_EQUIPO = [
  { label: 'Activo', value: 'activo' },
  { label: 'Mantenimiento', value: 'mantenimiento' },
  { label: 'Inactivo', value: 'inactivo' },
];

/**
 * Crea el payload que espera el backend real.
 * NOTA: modelo, estanqueId y horasMantenimiento NO se envían
 * todavía porque el backend no tiene esas columnas. El campo
 * 'nombre' del formulario tampoco se envía — se usa codigoInterno
 * como el identificador único que el backend espera.
 */
export function crearEquipoPayload(formulario) {
  return {
    identificador: formulario.codigoInterno.trim(),
    descripcion: formulario.descripcion.trim(),
    fechaInstalacion: formulario.fechaInstalacion,
    tipo: formulario.tipo,
    estado: formulario.estado,
    funcionEquipo: formulario.funcionEquipo.trim(),
  };
}

export async function agregarEquipo(payload) {
  try {
    const nuevoEquipo = await equiposService.createEquipo(payload);
    return nuevoEquipo;
  } catch (error) {
    // Propaga el mensaje real del backend (ej. "Ya existe un equipo con ese identificador.")
    throw new Error(error.message || 'No se pudo guardar el equipo. Intente nuevamente.');
  }
}

export async function actualizarEquipo(id, payload) {
  try {
    const equipoActualizado = await equiposService.updateEquipo(id, payload);
    return equipoActualizado;
  } catch (error) {
    throw new Error(error.message || 'No se pudo actualizar el equipo. Intente nuevamente.');
  }
}