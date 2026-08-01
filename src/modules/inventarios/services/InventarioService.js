/**
 * InventarioService.js
 * Capa de servicios HTTP para el módulo de inventarios.
 *
 * FUNCIONALIDAD:
 * - Se conecta de forma asíncrona con la API (axios).
 * - Gestiona operaciones CRUD (leer, agregar, actualizar, eliminar).
 *
 * REGLAS IMPORTANTES:
 * - No incluye lógica de UI; solo peticiones y parseo básico de datos.
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
    if(error.response){
      throw error;
    }
    throw new Error("No se pudieron obtener los productos del inventario")
  }
}

export async function getProductoById(id) {
  try {
    const response = await api.get(`/inventario/${id}`);

    return response.data.data;
  } catch (error) {
   if(error.response){
      throw error;
    }
    throw new Error("No se pudo obtener el producto del inventario")
  }
}

export async function addProducto({ producto_id,proveedor_id, stock_minimo }) {
  try {
    const response = await api.post("/inventario", {
      producto_id,
      proveedor_id,
      stock_minimo,
    });

    return response.data;
  } catch (error) {
   if(error.response){
      throw error;
    }
    throw new Error("No se pudo registrar el producto en el inventario")
  }
}

export async function updateProducto(id, { proveedor_id, stock_minimo }) {
  try {
    const response = await api.put(`/inventario/${id}`,{
      proveedor_id,
      stock_minimo,
    });

    return response.data;
  } catch (error) {
    if(error.response){
      throw error;
    }
    throw new Error("No se pudo actualizar el producto del inventario")
  }
}

export async function deleteProducto(id) {
  try {
    const response = await api.delete(`/inventario/${id}`);

    return response.data;
  } catch (error) {
     if(error.response){
      throw error;
    }
    throw new Error("No se pudo eliminar el producto del inventario")
  }
}
