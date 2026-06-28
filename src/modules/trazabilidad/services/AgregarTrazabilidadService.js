/**
 * Servicio temporal para registrar nuevos movimientos de Trazabilidad.
 * Posteriormente debera conectarse con la base de datos o API.
 *
 * Este registro es un hecho histórico: no existe función de edición
 * ni de borrado, tal como lo establece la especificación del módulo.
 */

import {
  obtenerFincas,
  obtenerColaboradores,
  obtenerEstanquesPorFinca,
  obtenerRegistrosTrazabilidad,
  agregarRegistroTrazabilidad,
} from "./TrazabilidadServices";

export function crearRegistroTrazabilidad(formData) {
  const fincas = obtenerFincas();
  const colaboradores = obtenerColaboradores();
  const estanques = obtenerEstanquesPorFinca(formData.fincaId);
  const registrosActuales = obtenerRegistrosTrazabilidad();

  const finca = fincas.find((item) => item.value === formData.fincaId);
  const colaborador = colaboradores.find(
    (item) => item.value === formData.colaboradorId,
  );
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
    colaboradorId: formData.colaboradorId,
    colaboradorNombre: colaborador?.label ?? "",
    tamaño: formData.tamaño,
    dias: formData.dias,
    pl: formData.pl,
    tipoMovimiento: "Pre-cria a Engorde",
  };

  return agregarRegistroTrazabilidad(nuevoRegistro);
}
