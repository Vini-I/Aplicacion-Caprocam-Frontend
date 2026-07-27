/**
 * ============================================================
 * REGLAS DE VALIDACIÓN COMPARTIDAS - SIEMBRA / PRE-CRÍA
 * ============================================================
 * FUNCIONALIDAD:
 * 
 * Antes existían dos listas de campos obligatorios duplicadas
 * (una en useNuevaSiembra y otra en useDetalleSiembra) y estaban
 * desincronizadas: la de edición no contemplaba Pre-Cría.
 *
 * Este módulo centraliza esa lógica para que "Crear" y "Editar"
 * validen exactamente igual, según el tipo de registro:
 *   - "siembra"
 *   - "precria"
 *
 * Para Pre-Cría se distinguen dos momentos:
 *   - Registro / edición normal (datos de inicio).
 *   - Finalización (además exige los datos de cierre del ciclo:
 *     fecha de salida, cantidad final y PL final).
 */

export const camposSiembraObligatorios = [
  "fechaSiembra",
  "finca",
  "estanque",
  "tecnicaCultivo",
  "duracionCiclo",
  "proveedorLarva",
  "laboratorioLarva",
  "procedenciaLarva",
  "codigoLoteLarva",
  "plSiembra",
  "certificadoLarva",
  "areaHectareas",
  "densidadPoblacional",
  "cantidadSembrada",
];

// Campos que se piden al iniciar / editar una Pre-Cría en curso.
export const camposPrecriaObligatorios = [
  "finca",
  "estanque",
  "fechaInicio",
  "duracionDias",
  "cantidadInicial",
  "plInicial",
  "proveedorLarva",
  "laboratorioLarva",
  "procedenciaLarva",
  "codigoLoteLarva",
  "certificadoLarva",
];

// Campos adicionales exigidos únicamente al presionar
// "Finalizar Pre-Cría" (datos de cierre del ciclo).
export const camposPrecriaFinalizarObligatorios = [
  ...camposPrecriaObligatorios,
  "fechaFin",
  "cantidadFinal",
  "plFinal",
];

/**
 * Devuelve la lista de campos obligatorios según el tipo de
 * registro y el contexto (creación/edición normal o finalización
 * de una Pre-Cría).
 */
export function obtenerCamposObligatorios(formData, { finalizando = false } = {}) {
  if (!formData) {
    return camposSiembraObligatorios;
  }

  if (formData.tipoRegistro === "precria") {
    return finalizando
      ? camposPrecriaFinalizarObligatorios
      : camposPrecriaObligatorios;
  }

  const campos = [...camposSiembraObligatorios];

  if (formData.pasoPorPrecria === "si") {
    campos.push("duracionPrecria", "fechaSalidaPrecria", "cantidadSobrevivientePrecria");
  }

  return campos;
}
