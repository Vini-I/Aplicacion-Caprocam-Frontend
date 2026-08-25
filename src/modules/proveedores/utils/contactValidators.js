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

export const telefonoRegex = /^[0-9]{8}$/;
export const correoRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(com|org|net|edu|gov|io|co|biz|info|cr|ac\.cr|co\.cr|ed\.cr|gob\.cr|or\.cr|sa\.cr|es|mx|cl|ar|us|uk)$/i;

export function validarNombre(
  valor,
  {
    mensajeObligatorio = "El nombre de la empresa es obligatorio.",
    mensajeInvalido = "El nombre de la empresa debe tener al menos 3 caracteres.",
  } = {}
) {
  const valorLimpio = (valor || "").trim();
  if (!valorLimpio) return mensajeObligatorio;
  if (valorLimpio.length < 3) return mensajeInvalido;
  return "";
}

export function validarTelefono(
  valor,
  {
    mensajeObligatorio = "El teléfono es obligatorio.",
    mensajeInvalido = "Ingrese un teléfono válido de 8 dígitos. Ej: 12345678",
  } = {}
) {
  const valorLimpio = (valor || "").trim();
  if (!valorLimpio) return mensajeObligatorio;
  if (!telefonoRegex.test(valorLimpio)) return mensajeInvalido;
  return "";
}

export function validarCorreo(
  valor,
  {
    mensajeObligatorio = "El correo electrónico es obligatorio.",
    mensajeInvalido = "Ingrese un correo electrónico válido. Ej: ventas@empresa.com",
    mensajeMinimo = "El correo debe tener al menos 3 caracteres antes del @.",
  } = {}
) {
  const valorLimpio = (valor || "").trim();
  if (!valorLimpio) return mensajeObligatorio;
  
  const partes = valorLimpio.split("@");
  if (partes.length === 2 && partes[0].length < 3) {
    return mensajeMinimo;
  }

  if (!correoRegex.test(valorLimpio)) {
    return mensajeInvalido;
  }
  return "";
}

export function validarDireccion(
  valor,
  {
    mensajeObligatorio = "La dirección es obligatoria.",
    mensajeInvalido = "La dirección no puede exceder 255 caracteres.",
  } = {}
) {
  const valorLimpio = (valor || "").trim();
  if (!valorLimpio) return mensajeObligatorio;
  if (valorLimpio.length > 255) return mensajeInvalido;
  return "";
}

// Formato visual del teléfono con máscara ####-#### (ej. 1234-5678)
export function formatearTelefono(valor) {
  const limpio = (valor || "").replace(/[^\d]/g, "");
  const soloNumero = limpio.startsWith("506") ? limpio.slice(3) : limpio;
  const maxOcho = soloNumero.slice(0, 8);
  if (maxOcho.length > 4) {
    return `${maxOcho.slice(0, 4)}-${maxOcho.slice(4)}`;
  }
  return maxOcho;
}

// Formato de 8 dígitos que exige el backend.
export function normalizarTelefonoParaBackend(telefono) {
  const limpio = (telefono || "").replace(/[^\d]/g, "");
  const soloNumero = limpio.startsWith("506") ? limpio.slice(3) : limpio;

  if (soloNumero.length !== 8) return telefono || "";

  return soloNumero.slice(0, 8);
}