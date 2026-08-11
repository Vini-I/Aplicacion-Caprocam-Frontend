/**
 * ============================================================
 * SERVICIO AgregarTrazabilidadService
 * ============================================================
 *
 * Descripción:
 * Procesa el envío de nuevos registros de trazabilidad formateando campos e integrando toMysqlDate.
 *
 * @dependencies toMysqlDate (shared/utils/dateUtils), crearRegistro (TrazabilidadServices)
 * @validations Convierte la fecha dd/mm/aaaa a YYYY-MM-DD MySQL antes de enviar al backend.
 * @navigation N/A
 */
import { toMysqlDate } from "../../../shared/utils/dateUtils";
import { crearRegistro } from "./TrazabilidadServices";

export async function crearRegistroTrazabilidad(formData) {
  const body = {
    fincaId: Number(formData.fincaId) || formData.fincaId,
    estanqueOrigenId: Number(formData.estanqueOrigenId) || formData.estanqueOrigenId,
    estanqueDestinoId: Number(formData.estanqueDestinoId) || formData.estanqueDestinoId,
    fecha: toMysqlDate(formData.fecha) || formData.fecha,
    colaboradorId: formData.colaboradorId ? Number(formData.colaboradorId) : null,
    tamano: Number(formData.tamaño),
    dias: Number(formData.dias),
    pl: Number(formData.pl),
  };

  return crearRegistro(body);
}