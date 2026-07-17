/**
 * ============================================================
 * UTILIDADES DE CÁLCULO - SIEMBRA
 * ============================================================
 *
 * Contiene funciones puras relacionadas con cálculos del módulo
 * de Siembra.
 *
 * FUNCIONALIDAD:
 * - Calcula la cantidad sembrada según área y densidad.
 * - Calcula el progreso del ciclo (día actual / duración total).
 *
 * No depende de React ni componentes visuales.
 */
export function calcularCantidadSembrada(
  areaHectareas,
  densidadPoblacional,
) {
  const area = Number(areaHectareas);
  const densidad = Number(densidadPoblacional);

  if (Number.isNaN(area) || Number.isNaN(densidad)) {
    return "";
  }

  if (area <= 0 || densidad <= 0) {
    return "";
  }

  return String(Math.round(area * 10000 * densidad));
}

/**
 * Calcula el progreso del ciclo productivo de una siembra o
 * pre-cría a partir de sus días de cultivo y su duración total.
 * Punto único para este cálculo: lo usan tanto el detalle como
 * el listado, para que ambos midan el progreso de la misma forma.
 */
export function calcularProgresoCiclo(registro) {
  if (!registro) {
    return { totalDias: 0, diaActual: 0, progreso: 0 };
  }

  const totalDias =
    Number(
      registro.tipoRegistro === "precria"
        ? registro.duracionDias
        : registro.diasMaduracion,
    ) || 0;

  const diaActual = Number(registro.diasCultivo) || 0;

  const progreso =
    totalDias > 0 ? Math.round((diaActual / totalDias) * 100) : 0;

  return { totalDias, diaActual, progreso };
}