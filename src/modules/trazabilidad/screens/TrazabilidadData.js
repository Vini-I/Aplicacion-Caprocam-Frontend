/**
 * Datos estaticos del modulo Trazabilidad.
 *
 * initialForm: estado inicial del formulario "Agregar Trazabilidad".
 * El campo dias viene prellenado con "30" (valor tipico del ciclo
 * de pre-cria), tal como lo pide la especificacion del modulo.
 */

import { getCurrentDate } from "../../../shared/utils/dateUtils";

export const initialForm = {
  fincaId: "",
  estanqueOrigenId: "",
  estanqueDestinoId: "",
  fecha: getCurrentDate(),
  tamaño: "",
  dias: "30",
  pl: "",
};