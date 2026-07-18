/**
 * ============================================================
 * SERVICIO - AGREGAR TRAZABILIDAD
 * ============================================================
 *
 * Descripción:
 * Servicio que crea un nuevo registro de trazabilidad en la
 * colección local (placeholder). Construye el objeto de registro
 * a partir del `formData` y delega la persistencia a
 * `agregarRegistroTrazabilidad`.
 *
 * Reglas importantes:
 * - El registro es histórico: no hay edición ni borrado.
 * - Validaciones complejas deben ejecutarse antes de llamar aquí.
 */

import {
  obtenerFincas,
  obtenerColaboradorSesion,
  obtenerEstanquesPorFinca,
  obtenerRegistrosTrazabilidad,
  agregarRegistroTrazabilidad,
} from "./TrazabilidadServices";

export function crearRegistroTrazabilidad(formData) {
  const fincas = obtenerFincas();
  const colaboradorSesion = obtenerColaboradorSesion();
  const estanques = obtenerEstanquesPorFinca(formData.fincaId);
  const registrosActuales = obtenerRegistrosTrazabilidad();

  const finca = fincas.find((item) => item.value === formData.fincaId);
  const origen = estanques.find(
    (item) => item.value === formData.estanqueOrigenId,
  );
  const destino = estanques.find(
    (item) => item.value === formData.estanqueDestinoId,
  );

  const nuevoRegistro = {
    id: registrosActuales.length + 1,
    fincaId: formData.fincaId,
    fincaNombre: finca?.label ?? "",
    estanqueOrigenId: formData.estanqueOrigenId,
    estanqueOrigenLabel: origen?.label ?? "",
    estanqueDestinoId: formData.estanqueDestinoId,
    estanqueDestinoLabel: destino?.label ?? "",
    fecha: formData.fecha,
    colaboradorId: colaboradorSesion.value,
    colaboradorNombre: colaboradorSesion.label,
    tamaño: formData.tamaño,
    dias: formData.dias,
    pl: formData.pl,
    tipoMovimiento: "Pre-cria a Engorde",
  };

  return agregarRegistroTrazabilidad(nuevoRegistro);
}
