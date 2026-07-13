/**
 * ============================================================
 * SERVICIO: registrarEquipoService
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Expone catálogos y el payload normalizado para el formulario
 * de registro de equipos. Ahora también conecta con equiposService
 * para persistir el equipo en el mock global y actualizar la lista.
 * ============================================================
 */

import { equiposService } from './equiposService';

export const TIPOS_EQUIPO = [
  { label: "Aireación", value: "aireacion" },
  { label: "Bombeo", value: "bombeo" },
  { label: "Alimentación", value: "alimentacion" },
  { label: "Monitoreo", value: "monitoreo" },
  { label: "Mantenimiento", value: "mantenimiento" },
  { label: "Otro", value: "otro" },
];

export const ESTADOS_EQUIPO = [
  { label: "Activo", value: "activo" },
  { label: "Mantenimiento", value: "mantenimiento" },
  { label: "Inactivo", value: "inactivo" },
];

/**
 * Crea el payload que espera equiposService.createEquipo
 * a partir del formulario de registro.
 */
export function crearEquipoPayload(formulario) {
  return {
    nombre: formulario.nombre.trim(),
    descripcion: formulario.descripcion.trim(),
    tipo: formulario.tipo,
    subcategoria: "", // no se solicita en el formulario
    marca: "", // no se solicita
    modelo: formulario.modelo.trim(),
    serie: formulario.codigoInterno.trim(),
    fechaInstalacion: formulario.fechaInstalacion,
    funcionEquipo: formulario.funcionEquipo.trim(),
    ubicacion: "", // no se solicita
    estanqueId: formulario.estanqueId || "",
    estado: formulario.estado,
    horasMantenimiento: Number(formulario.horasMantenimiento) || 500,
  };
}

/**
 * Agrega un nuevo equipo usando equiposService.
 * Esto actualiza el mock global, por lo que la lista de equipos
 * se refrescará al navegar de vuelta.
 */
export async function agregarEquipo(payload) {
  try {
    const nuevoEquipo = await equiposService.createEquipo(payload);
    return nuevoEquipo;
  } catch (error) {
    throw new Error('No se pudo guardar el equipo. Intente nuevamente.');
  }
}