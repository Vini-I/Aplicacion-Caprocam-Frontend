import { normalizarTelefonoParaBackend } from "../utils/contactValidators.js";

/**
 * proveedor.dto.js
 * DTO para formatear los datos del proveedor antes de enviarlos al backend.
 *
 * FUNCIONALIDAD:
 * - Limpia (trim) los campos de texto y previene inyección accidental.
 * - Formatea el teléfono utilizando utils/contactValidators.
 * - Prepara el payload estandarizado para la API (Frontend -> Backend).
 * - Elimina la variable grupoDatos conforme al nuevo requerimiento.
 *
 * REGLAS IMPORTANTES:
 * - Envía todas las variables en camelCase (el DTO del backend ya
 *   responde/acepta camelCase, por lo que no se necesita snake_case).
 * - No incluye ID; el ID se maneja en el path param del controlador.
 * - Toda limpieza de strings antes del guardado sucede exclusivamente aquí.
 *
 * @dependencies - contactValidators
 * @validations - N/A
 * @navigation - N/A
 */

export class ProveedorDTO {
  constructor({
    nombre,
    tipoProducto,
    telefono,
    correo,
    direccion,
    notas,
  }) {
    const nombreLimpio = (nombre || "").trim();
    const telefonoNormalizado = normalizarTelefonoParaBackend(telefono);
    const correoLimpio = (correo || "").trim();

    this.nombre = nombreLimpio;
    this.tipoProducto = tipoProducto;
    this.telefono = telefonoNormalizado;
    this.correo = correoLimpio;
    this.direccion = (direccion || "").trim();
    this.notas = notas ? notas.trim() : "";
  }
}