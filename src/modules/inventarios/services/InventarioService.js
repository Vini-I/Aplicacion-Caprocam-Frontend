/**
 * InventarioService.js
 * Capa de servicios HTTP para el módulo de inventarios.
 *
 * FUNCIONALIDAD:
 * - Se conecta de forma asíncrona con la API (axios).
 * - Trae el listado de inventario (solo lectura).
 *
 * REGLAS IMPORTANTES:
 * - Este módulo es SOLO LECTURA. El alta, edición y baja de productos
 *   (incluyendo cantidad y stock_minimo) se hace desde el módulo
 *   Productos, vía POST/PUT/DELETE /productos, que crea y sincroniza
 *   el registro de inventario por su cuenta. Por eso aquí NO existen
 *   addProducto/updateProducto/deleteProducto/getProductoById: nadie
 *   los necesita y mantenerlos como código muerto solo genera
 *   confusión sobre a qué módulo le corresponde cada operación.
 * - Si en el futuro Inventario necesita escribir datos propios (por
 *   ejemplo, ajustar stock_minimo sin pasar por Productos), ese
 *   endpoint ya existe en el backend (POST/PUT/DELETE /inventario) y
 *   se puede reintroducir aquí en ese momento.
 *
 * @dependencies - axios api instance
 * @validations - N/A
 * @navigation - N/A
 */
import api from "../../../api/api";

export async function getProductosInventario() {
  try {
    const response = await api.get("/inventario");

    return response.data.data;
  } catch (error) {
    if (error.response) {
      throw error;
    }
    throw new Error("No se pudieron obtener los productos del inventario");
  }
}