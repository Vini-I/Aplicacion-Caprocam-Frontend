/**
 * ============================================================
 * DTO: InventarioDTO
 * ============================================================
 *
 * Responsabilidad:
 * Objeto de Transferencia de Datos (DTO) para normalizar y estructurar 
 * la información del inventario antes de ser procesada por la capa de 
 * servicios o la interfaz de usuario.
 *
 * Propiedades:
 * - Producto: Objeto asociado o identificador del producto (por defecto null).
 * - proveedor: Proveedor asignado al registro de inventario.
 * - cantidad: Cantidad numérica actual en stock.
 * - unidad: Unidad de medida (ej. kg, litros, unidades).
 * - stockMinimo: Límite numérico mínimo permitido antes de alerta de stock bajo.
 *
 * Dependencias:
 * Ninguna. Es utilizado por los servicios y componentes del módulo.
 * ============================================================
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
