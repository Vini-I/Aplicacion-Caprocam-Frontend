import { getCrecimiento } from "../../mantCrecimiento/services/mantCrecimiento.service";

export async function obtenerDetalleReporte({
  tipoRegistro,
  fincaId,
  estanqueId,
}) {

  switch(tipoRegistro){
    
    case "crecimiento": 
      return getCrecimiento({
        fincaId,
        estanqueId
      })
      
    default: 
      return [];
  }

}