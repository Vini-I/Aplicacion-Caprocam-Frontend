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
 *   que solo pueda contener dígitos, dos puntos y las letras
 *   AM/PM (ej: "07:00 AM" o "07:00 PM"), nada más.
 */

export function formatearHoraIngreso(valor) {
  return String(valor ?? "")
    .toUpperCase()
    .replace(/[^0-9:APM ]/g, "");
}
