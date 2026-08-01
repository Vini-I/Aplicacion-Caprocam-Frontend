/**
 * contactValidators.js
 * Validador local para teléfono y correo.
 *
 * FUNCIONALIDAD:
 * - Valida y formatea datos de contacto en tiempo de envío.
 * - Formatea visualmente el teléfono mostrando solo 8 dígitos.
 * - Normaliza el formato de teléfono para el payload (API).
 * - Utilizado por hooks de edición y creación para centralizar lógica.
 *
 * REGLAS IMPORTANTES:
 * - El teléfono se fuerza a exactamente 8 dígitos en la UI.
 * - Utiliza expresiones regulares estrictas para el formato de correo.
 * - Este archivo pertenece al dominio de proveedores, no usar en global.
 *
 * @dependencies - N/A
 * @validations - Valida regex de correo y teléfono (8 dígitos)
 * @navigation - N/A
 */

export const TELEFONO_REGEX = /^[0-9]{8}$/;
export const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarTelefono(
  valor,
  {
    mensajeObligatorio = "El teléfono es obligatorio.",
    mensajeInvalido = "Ingrese un teléfono de 8 dígitos. Ej: 12345678",
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

// Formato visual del teléfono (solo 8 dígitos para el frontend).
export function formatearTelefono(valor) {
  const limpio = (valor || "").replace(/[^\d]/g, "");
  const soloNumero = limpio.startsWith("506") ? limpio.slice(3) : limpio;
  return soloNumero.slice(0, 8);
}

// Formato estricto +506 XXXX-XXXX que exige el backend.
export function normalizarTelefonoParaBackend(telefono) {
  const limpio = (telefono || "").replace(/[^\d]/g, "");
  const soloNumero = limpio.startsWith("506") ? limpio.slice(3) : limpio;

  if (soloNumero.length !== 8) return telefono || "";

  return `+506 ${soloNumero.slice(0, 4)}-${soloNumero.slice(4)}`;
}
