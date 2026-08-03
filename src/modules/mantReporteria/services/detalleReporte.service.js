import crecimientoService from "../../mantCrecimiento/services/mantCrecimiento.service";
import parasitologiaService from "../../parasitologia/services/ParasitologiaService";
import enfermedadesService from "../../enfermedades/services/EnfermedadesService";
import raleoService from "../../raleo/services/Raleo.service.js";
import alimentacionService from "../../alimentacion/services/Alimentacion.service";
import densidadPoblacionalService from "../../densidadPoblacional/services/DensidadPoblacional.service";
import { getLecturas } from "../../mantAgua/services/FisicoQuimicaServices.js";

export async function obtenerDetalleReporte({
  tipoRegistro,
  fincaId,
  estanqueId,
}) {

  switch(tipoRegistro){
    
case "crecimiento": {
  const registros = await crecimientoService.getAll();

  return registros.filter(
    (r) =>
      Number(r.finca ?? r.finca_id ?? r.fincaId) === Number(fincaId) &&
      Number(r.estanque ?? r.estanque_id ?? r.estanqueId) === Number(estanqueId)
  );
}

    case "parasitologia": 

      const registrosPara = await parasitologiaService.getAll();

      return registrosPara.filter(
        (r) => 
          Number(r.fincaId) === Number(fincaId) &&
          Number(r.estanqueId) === Number(estanqueId)
      )

case "enfermedades": {
  const registrosEnf = await enfermedadesService.getAll();

  return registrosEnf.filter(
    (r) =>
      Number(r.fincaId ?? r.finca_id ?? r.finca) === Number(fincaId) &&
      Number(r.estanqueId ?? r.estanque_id ?? r.estanque) === Number(estanqueId)
  );
}
  
    case "raleo":
      const registrosRaleo = await raleoService.getAll();

      return registrosRaleo.filter(
        (r) => 
          Number(r.idFinca) === Number(fincaId) &&
          Number(r.idEstanque) === Number(estanqueId)
      )

    case "alimentacion":
      const registrosAlim = await alimentacionService.getAll();

      return registrosAlim.filter(
        (r) => 
          Number(r.idFinca) === Number(fincaId) &&
          Number(r.idEstanque) === Number(estanqueId)
      )

    case "densidad_poblacional":
      const registrosDensidad = await densidadPoblacionalService.getAll(); 

      return registrosDensidad.filter(
        (r) => 
          Number(r.idFinca) === Number(fincaId) &&
          Number(r.idEstanque) === Number(estanqueId)
      )

      case "fisico_quimico": {
  const registrosFq = await getLecturas();
  return (Array.isArray(registrosFq) ? registrosFq : []).filter(
    (r) =>
      Number(r.fincaId ?? r.finca_id ?? r.finca) === Number(fincaId) &&
      Number(r.estanqueId ?? r.estanque_id ?? r.estanque) === Number(estanqueId)
  );
}

    default: 
      return [];
  }

}