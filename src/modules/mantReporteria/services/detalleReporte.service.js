import { getCrecimiento } from "../../mantCrecimiento/services/mantCrecimiento.service";
import parasitologiaService from "../../parasitologia/services/ParasitologiaService";
import enfermedadesService from "../../enfermedades/services/EnfermedadesService";

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
      
      console.log(registrosPara);

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
      
    default: 
      return [];
  }

}