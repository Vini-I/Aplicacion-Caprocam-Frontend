import { getCrecimiento } from "../../mantCrecimiento/services/mantCrecimiento.service";

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
      
    default: 
      return [];
  }

}