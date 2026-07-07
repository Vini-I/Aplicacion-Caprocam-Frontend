/**
 * Datos estaticos del modulo Trazabilidad.
 *
 * initialForm: estado inicial del formulario "Agregar Trazabilidad".
 * El campo dias viene prellenado con "30" (valor tipico del ciclo
 * de pre-cria), tal como lo pide la especificacion del modulo.
 *
 * registrosTrazabilidad: data temporal para poder probar el listado
 * mientras no exista conexion con el backend.
 */

export const initialForm = {
  fincaId: "",
  estanqueOrigenId: "",
  estanqueDestinoId: "",
  fecha: "",
  colaboradorId: "",
  tamaño: "",
  dias: "30",
  pl: "",
};

export const registrosTrazabilidad = [
  {
    id: 1,
    fincaId: "laReina",
    fincaNombre: "Finca Camarón de Occidente",
    estanqueOrigenId: "P-01",
    estanqueOrigenLabel: "Estanque P-01 (Pre-cría)",
    estanqueDestinoId: "E-08",
    estanqueDestinoLabel: "Estanque E-08 (Engorde)",
    fecha: "27/06/2026",
    colaboradorId: "marioJuarez",
    colaboradorNombre: "Mario Juárez",
    tamaño: "4.5",
    dias: "30",
    pl: "145000",
    tipoMovimiento: "Pre-cria a Engorde",
  },
  {
    id: 2,
    fincaId: "laEsperanza",
    fincaNombre: "Finca Camarón del Sur",
    estanqueOrigenId: "P-03",
    estanqueOrigenLabel: "Estanque P-03 (Pre-cría)",
    estanqueDestinoId: "E-02",
    estanqueDestinoLabel: "Estanque E-02 (Engorde)",
    fecha: "24/06/2026",
    colaboradorId: "elenaRostova",
    colaboradorNombre: "Elena Rostova",
    tamaño: "3.9",
    dias: "30",
    pl: "110000",
    tipoMovimiento: "Pre-cria a Engorde",
  },
];
