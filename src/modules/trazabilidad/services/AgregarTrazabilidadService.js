import { parseDate } from "../../../shared/utils/dateUtils";
import { crearRegistro } from "./TrazabilidadServices";

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

export async function crearRegistroTrazabilidad(formData) {
  const body = {
    fincaId: formData.fincaId,
    estanqueOrigenId: formData.estanqueOrigenId,
    estanqueDestinoId: formData.estanqueDestinoId,
    estanqueDestinoLabel: destino?.label ?? "",
    fecha: formData.fecha,
    colaboradorId: colaboradorSesion.value,
    colaboradorNombre: colaboradorSesion.label,
    tamaño: formData.tamaño,
    dias: formData.dias,
    pl: formData.pl,
  };

  return crearRegistro(body);
}