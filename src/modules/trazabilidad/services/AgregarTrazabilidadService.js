import { parseDate } from "../../../shared/utils/dateUtils";
import { crearRegistro } from "./TrazabilidadServices";

function aFechaISO(fechaTexto) {
  const fecha = parseDate(fechaTexto);
  if (!fecha) return fechaTexto;
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export async function crearRegistroTrazabilidad(formData) {
  const body = {
    fincaId: formData.fincaId,
    estanqueOrigenId: formData.estanqueOrigenId,
    estanqueDestinoId: formData.estanqueDestinoId,
    fecha: aFechaISO(formData.fecha),
    colaboradorId: formData.colaboradorId || null,
    tamano: formData.tamaño,
    dias: formData.dias,
    pl: formData.pl,
  };

  return crearRegistro(body);
}