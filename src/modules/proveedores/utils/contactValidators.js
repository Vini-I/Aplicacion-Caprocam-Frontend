/**
 * ============================================================
 * VALIDADORES DE CONTACTO (TELÉFONO / CORREO)
 * ============================================================
 *
 * Breve: Validador local del modulo proveedores para telefono y
 * correo, pensado para que useNuevoProveedorScreen.js y
 * useEditarProveedorScreen.js dejen de definir cada uno su propio
 * TELEFONO_REGEX / CORREO_REGEX y compartan la misma logica.
 *
 * No vive en shared/: es un util interno del modulo, no un
 * validador global de la app.
 *
 * Uso:
 *   const errorTelefono = validarTelefono(telefono, {
 *     mensajeInvalido: "Ingrese un teléfono válido. Ej: +506 2222-3344",
 *   });
 *
 * Los mensajes son configurables (mensajeObligatorio / mensajeInvalido)
 * para que cada screen pueda mantener su copy actual sin duplicar el
 * regex ni la logica de validacion.
 */

export const TELEFONO_REGEX = /^(\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/;
export const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarTelefono(
  valor,
  {
    mensajeObligatorio = "El teléfono es obligatorio.",
    mensajeInvalido = "Ingrese un teléfono válido. Ej: +506 2222-3344",
  } = {}
) {
  const valorLimpio = (valor || "").trim();
  if (!valorLimpio) return mensajeObligatorio;
  if (!TELEFONO_REGEX.test(valorLimpio)) return mensajeInvalido;
  return "";
}

export function validarCorreo(
  valor,
  {
    mensajeObligatorio = "El correo electrónico es obligatorio.",
    mensajeInvalido = "Ingrese un correo electrónico válido.",
  } = {}
) {
  const valorLimpio = (valor || "").trim();
  if (!valorLimpio) return mensajeObligatorio;
  if (!CORREO_REGEX.test(valorLimpio)) return mensajeInvalido;
  return "";
}
