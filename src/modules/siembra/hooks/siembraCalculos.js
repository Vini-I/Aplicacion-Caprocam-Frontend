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