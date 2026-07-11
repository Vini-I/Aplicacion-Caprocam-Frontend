/**
 * ============================================================
 * UTILIDADES DE FORMATEO - MÓDULO SIEMBRA
 * ============================================================
 *
 * Punto único dentro del módulo de Siembra para dar formato a
 * valores de texto ingresados por el usuario.
 *
 * FUNCIONALIDAD:
 * - formatearHoraIngreso: limpia el campo "Hora de ingreso" para
 *   que solo pueda contener dígitos, insertando automáticamente
 *   los dos puntos luego de los primeros 2 dígitos y limitando
 *   la entrada a 4 dígitos en total (ej: "0700" -> "07:00").
 *   El resultado se valida como hora militar (formato HH:mm,
 *   00-23:00-59) en validarCamposObligatorios.
 */

export function formatearHoraIngreso(valor) {
  let hora = String(valor ?? "")
    .replace(/\D/g, "") // Solo números
    .slice(0, 4); // Máximo 4 dígitos

  if (hora.length > 2) {
    hora = `${hora.slice(0, 2)}:${hora.slice(2)}`;
  }

  return hora;
}
