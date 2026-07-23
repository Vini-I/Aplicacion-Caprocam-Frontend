/**
 * ============================================================
 * SERVICIO: registrarEquipoService
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Expone catálogos y el payload normalizado para el formulario
 * de registro de equipos, y conecta con equiposService para
 * persistir contra la API real.
 *
 * NOTA sobre los catálogos: los values deben coincidir EXACTO
 * (mayúsculas y acentos) con los ENUM de MySQL, porque el backend
 * los compara con === (ver isTipoEquipo / isEstadoOperativoEquipo
 * en equipo.service.js). Si el backend agrega un valor nuevo al
 * ENUM, hay que agregarlo aquí también a mano.
 * ============================================================
 */

import api from '../../../api/api';

export const TIPOS_EQUIPO = [
  { label: 'Aireación', value: 'Aireacion' },
  { label: 'Bombeo', value: 'Bombeo' },
  { label: 'Alimentación', value: 'Alimentacion' },
  { label: 'Monitoreo', value: 'Monitoreo' },
  { label: 'Mantenimiento', value: 'Mantenimiento' },
  { label: 'Otro', value: 'Otro' },
];

export const ESTADOS_OPERATIVOS_EQUIPO = [
  { label: 'Activo', value: 'Activo' },
  { label: 'Mantenimiento', value: 'Mantenimiento' },
  { label: 'Inactivo', value: 'Inactivo' },
];

// NOTA: el backend valida explícitamente que fechaInstalacion venga
// en formato dd/mm/aaaa (confirmado por el 422 "El campo fechaInstalacion
// debe tener formato dd/mm/aaaa."), así que se envía tal cual la escribe
// el usuario en el formulario, sin convertir a ISO.

/**
 * Crea el payload que espera el backend real.
 *
 * - tipoEquipo / estadoOperativo: values ya son el enum exacto,
 *   no hace falta traducirlos.
 * - estado (Encendido/Apagado): se envía explícitamente "Apagado"
 *   al crear (así el botón de encendido/apagado en la lista de
 *   equipos arranca apagado). Al editar, se reenvía el estado
 *   actual del equipo para no apagarlo accidentalmente cada vez
 *   que se guardan cambios.
 * - horasActuales: mismo patrón que estado — se envía 0 explícito
 *   al crear, y se reenvía el valor actual al editar para no
 *   resetear las horas acumuladas del equipo.
 */
export function crearEquipoPayload(formulario, { isEditing, estadoActual, horasActualesActual } = {}) {
  return {
    identificador: formulario.codigoInterno.trim(),
    nombreEquipo: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim(),
    tipoEquipo: formulario.tipo,
    fechaInstalacion: formulario.fechaInstalacion,
    estadoOperativo: formulario.estadoOperativo,
    funcionEquipo: formulario.funcionEquipo.trim(),
    estado: isEditing && estadoActual ? estadoActual : 'Apagado',
    horasActuales: isEditing && horasActualesActual !== undefined ? horasActualesActual : 0,
    ...(formulario.estanqueId ? { estanqueId: Number(formulario.estanqueId) } : {}),
    ...(formulario.horasMantenimiento
      ? { horasMantenimiento: Number(formulario.horasMantenimiento) }
      : {}),
  };
}

export async function agregarEquipo(payload) {
  try {
    // NOTA: se llama a `api` directamente (no a equiposService.createEquipo)
    // porque equiposService ahora espera datos en formato "frontend" (codigo,
    // nombre, tipo en minúscula...) y los remapea con mapEquipoFrontendABackend
    // antes de mandarlos. Este payload ya viene armado en el formato exacto
    // del backend, así que pasar por ese mapeo duplicado lo rompía (identificador
    // y nombreEquipo llegaban undefined).
    const response = await api.post('/equipos', payload);
    return response.data.data;
  } catch (error) {
    // Propaga el mensaje real del backend (ej. "Ya existe un equipo con ese identificador.")
    throw new Error(error.response?.data?.message || 'No se pudo guardar el equipo. Intente nuevamente.');
  }
}

export async function actualizarEquipo(id, payload) {
  try {
    const response = await api.put(`/equipos/${id}`, payload);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'No se pudo actualizar el equipo. Intente nuevamente.');
  }
}