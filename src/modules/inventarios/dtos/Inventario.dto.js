/**
 * Inventario.dto.js
 * DTO para normalizar la información del inventario.
 *
 * FUNCIONALIDAD:
 * - Estructura los datos antes de ser enviados al backend.
 * - Convierte las cantidades y stock mínimo a valores numéricos.
 *
 * REGLAS IMPORTANTES:
 * - Sirve como puente entre los campos del formulario y el payload.
 *
 * @dependencies - N/A
 * @validations - Convierte string a Number para cantidades
 * @navigation - N/A
 */

export class InventarioDTO {
  constructor({ Producto = null, proveedor, cantidad, unidad, stockMinimo }) {
    this.grupoDatos = 1; //Temporal
    this.Producto = Producto;
    this.proveedor = proveedor;
    this.cantidad = Number(cantidad);
    this.unidad = unidad;
    this.stockMinimo = Number(stockMinimo);
  }
}
