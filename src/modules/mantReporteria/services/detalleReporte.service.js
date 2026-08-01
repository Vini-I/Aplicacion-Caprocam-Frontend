import { getCrecimiento } from "../../mantCrecimiento/services/mantCrecimiento.service";
import parasitologiaService from "../../parasitologia/services/ParasitologiaService";
import enfermedadesService from "../../enfermedades/services/EnfermedadesService";
import raleoService from "../../raleo/services/Raleo.service";

export async function obtenerDetalleReporte({
  tipoRegistro,
  fincaId,
  estanqueId,
}) {

  switch(tipoRegistro){
    
    case "crecimiento": 
      const registros = await getCrecimiento();

      return registros.filter(
        (r) => 
          Number(r.finca_id) === Number(fincaId) &&
          Number(r.estanque_id) === Number(estanqueId)
      )

    case "parasitologia": 

      const registrosPara = await parasitologiaService.getAll();

      return registrosPara.filter(
        (r) => 
          Number(r.fincaId) === Number(fincaId) &&
          Number(r.estanqueId) === Number(estanqueId)
      )

    case "enfermedades":

      const registrosEnf = await enfermedadesService.getAll();
      
      return registrosEnf.filter(
        (r) => 
          Number(r.fincaId) === Number(fincaId) &&
          Number(r.estanqueId) === Number(estanqueId)
      )
  
    case "raleo":
      const registrosRaleo = await raleoService.getAll();

      return registrosRaleo.filter(
        (r) => 
          Number(r.idFinca) === Number(fincaId) &&
          Number(r.idEstanque) === Number(estanqueId)
      )
      
    default: 
      return [];
  }

}