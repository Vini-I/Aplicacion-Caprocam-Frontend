/**
 * ============================================================
 * VALIDADORES DE CONTACTO (TELÉFONO / CORREO)
 * ============================================================
 *
 * Validador local del módulo Proveedores para teléfono y correo,
 * usado por useNuevoProveedorScreen.js y useEditarProveedorScreen.js.
 *
 * FUNCIONALIDAD:
 * 1. validarTelefono / validarCorreo: validan lo escrito en el formulario.
 * 2. formatearTelefono: formato visual para listados y detalle.
 * 3. normalizarTelefonoParaBackend: formato estricto +506 XXXX-XXXX
 *    para el payload (usado por ProveedorDTO).
 *
 * IMPORTANTE: no vive en shared/, es interno del módulo.
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

// Formato visual del teléfono (XXXX-XXXX, con "+506 " si aplica).
export function formatearTelefono(valor) {
  const limpio = (valor || "").replace(/[^\d+]/g, "");
  const tienePrefijo = limpio.startsWith("+506");
  const soloNumero = tienePrefijo ? limpio.slice(4) : limpio.replace(/^\+/, "");

  if (soloNumero.length !== 8) return valor || "";

  const numeroFormateado = `${soloNumero.slice(0, 4)}-${soloNumero.slice(4)}`;
  return tienePrefijo ? `+506 ${numeroFormateado}` : numeroFormateado;
}

// Formato estricto +506 XXXX-XXXX que exige el backend.
export function normalizarTelefonoParaBackend(telefono) {
  const limpio = (telefono || "").replace(/[^\d]/g, "");
  const soloNumero = limpio.startsWith("506") ? limpio.slice(3) : limpio;

  if (soloNumero.length !== 8) return telefono || "";

  return `+506 ${soloNumero.slice(0, 4)}-${soloNumero.slice(4)}`;
}
