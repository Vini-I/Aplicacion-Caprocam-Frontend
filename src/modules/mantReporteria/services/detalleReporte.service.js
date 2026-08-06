import crecimientoService from "../../mantCrecimiento/services/mantCrecimiento.service";
import parasitologiaService from "../../parasitologia/services/ParasitologiaService";
import enfermedadesService from "../../enfermedades/services/EnfermedadesService";
import raleoService from "../../raleo/services/Raleo.service.js";
import alimentacionService from "../../alimentacion/services/Alimentacion.service";
import densidadPoblacionalService from "../../densidadPoblacional/services/DensidadPoblacional.service";
import { getLecturas } from "../../mantAgua/services/FisicoQuimicaServices.js";

/**
 * El backend devuelve los registros en el orden en que se
 * guardaron (el más viejo primero). Para mostrar el último
 * guardado primero, simplemente se invierte el arreglo.
 */
function ordenarRecientesPrimero(registros = []) {
  return Array.isArray(registros) ? [...registros].reverse() : [];
}

export async function obtenerDetalleReporte({
  tipoRegistro,
  fincaId,
  estanqueId,
}) {

  switch (tipoRegistro) {

    case "crecimiento": {
      const registros = await crecimientoService.getAll();

      return ordenarRecientesPrimero(
        registros.filter(
          (r) =>
            Number(r.finca ?? r.finca_id ?? r.fincaId) === Number(fincaId) &&
            Number(r.estanque ?? r.estanque_id ?? r.estanqueId) === Number(estanqueId)
        )
      );
    }

    case "parasitologia":

      const registrosPara = await parasitologiaService.getAll();

      return ordenarRecientesPrimero(
        registrosPara.filter(
          (r) =>
            Number(r.fincaId) === Number(fincaId) &&
            Number(r.estanqueId) === Number(estanqueId)
        )
      )

    case "enfermedades": {
      const registrosEnf = await enfermedadesService.getAll();

      return ordenarRecientesPrimero(
        registrosEnf.filter(
          (r) =>
            Number(r.fincaId ?? r.finca_id ?? r.finca) === Number(fincaId) &&
            Number(r.estanqueId ?? r.estanque_id ?? r.estanque) === Number(estanqueId)
        )
      );
    }

    case "raleo":
      const registrosRaleo = await raleoService.getAll();

      return ordenarRecientesPrimero(
        registrosRaleo.filter(
          (r) =>
            Number(r.idFinca) === Number(fincaId) &&
            Number(r.idEstanque) === Number(estanqueId)
        )
      )

    case "alimentacion":
      const registrosAlim = await alimentacionService.getAll();

      return ordenarRecientesPrimero(
        registrosAlim.filter(
          (r) =>
            Number(r.idFinca) === Number(fincaId) &&
            Number(r.idEstanque) === Number(estanqueId)
        )
      )

    case "densidad_poblacional":
      const registrosDensidad = await densidadPoblacionalService.getAll();

      return ordenarRecientesPrimero(
        registrosDensidad.filter(
          (r) =>
            Number(r.idFinca) === Number(fincaId) &&
            Number(r.idEstanque) === Number(estanqueId)
        )
      )

    case "fisico_quimico": {
      const registrosFq = await getLecturas();
      return ordenarRecientesPrimero(
        (Array.isArray(registrosFq) ? registrosFq : []).filter(
          (r) =>
            Number(r.fincaId ?? r.finca_id ?? r.finca) === Number(fincaId) &&
            Number(r.estanqueId ?? r.estanque_id ?? r.estanque) === Number(estanqueId)
        )
      );
    }

    default:
      return [];
  }

}