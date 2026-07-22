import { normalizarTelefonoParaBackend } from "../utils/contactValidators.js";

/**
 * ============================================================
 * DTO DE PROVEEDOR (FRONTEND -> BACKEND)
 * ============================================================
 *
 * Arma el payload que se envía al backend al crear/actualizar un
 * proveedor.
 *
 * FUNCIONALIDAD:
 * 1. Limpia (trim) los campos de texto.
 * 2. Normaliza el teléfono al formato +506 XXXX-XXXX en proveedorContacto.utils.js.
 * 3. Tipo de producto: usa el mismo value del catálogo
 *    tiposProducto de proveedor.service.js única fuente.
 *
 * IMPORTANTE:
 * El backend valida el body en dos capas con nombres distintos:
 *  - middleware  -> nombre, tipoProducto camelCase
 *  - controller  -> nombre_empresa, tipo_producto snake_case
 * Por eso se envían ambas variantes. Corregido el backend, los
 * campos snake_case pueden eliminarse.
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
    this.grupoDatos = 1; // Temporal hasta implementar Grupo de Datos

    const nombreLimpio = (nombre || "").trim();
    const telefonoNormalizado = normalizarTelefonoParaBackend(telefono);
    const correoLimpio = (correo || "").trim();

    this.nombre = nombreLimpio;
    this.nombre_empresa = nombreLimpio;

    this.tipoProducto = tipoProducto;
    this.tipo_producto = tipoProducto;

    this.telefono = telefonoNormalizado;

    this.correo = correoLimpio;
    this.correo_electronico = correoLimpio;

    this.direccion = (direccion || "").trim();
    this.notas = notas ? notas.trim() : "";
  }
}