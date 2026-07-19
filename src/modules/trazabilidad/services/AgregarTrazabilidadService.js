/**
 * ============================================================
 * SERVICIO - AGREGAR TRAZABILIDAD
 * ============================================================
 *
 * Descripción:
 * Arma el body y crea un nuevo registro de trazabilidad contra la
 * API. El backend regresa el registro completo (con nombres de
 * finca/estanque/colaborador), ya no hace falta armarlo a mano.
 *
 * Reglas importantes:
 * - El registro es histórico: no hay edición ni borrado.
 * - Validaciones complejas deben ejecutarse antes de llamar aquí.
 */

import { obtenerColaboradorSesion, crearRegistro } from "./TrazabilidadServices";

export async function crearRegistroTrazabilidad(formData) {
  const colaboradorSesion = obtenerColaboradorSesion();

  // TODO: confirmar formato de fecha esperado por la API (front usa dd/mm/aaaa)
  const body = {
    fincaId: formData.fincaId,
    estanqueOrigenId: formData.estanqueOrigenId,
    estanqueDestinoId: formData.estanqueDestinoId,
    fecha: formData.fecha,
    colaboradorId: colaboradorSesion.value,
    tamano: formData.tamaño,
    dias: formData.dias,
    pl: formData.pl,
  };

  return crearRegistro(body);
}