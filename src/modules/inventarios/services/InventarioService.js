// modules/inventarios/services/inventarioService.js

/**
 * ============================================================
 * SERVICE: InventarioService
 * ============================================================
 *
 * Responsabilidad:
 * Capa de servicios y comunicación HTTP para el módulo de inventarios.
 * Se conecta de forma asíncrona con la API para gestionar las operaciones
 * CRUD (leer, agregar, actualizar y eliminar) de los productos del inventario.
 *
 * Datos:
 * Cada producto del inventario contiene:
 *  id: ID del registro en inventario
 *  productoId: ID del producto en el módulo de Productos
 *  codigo: Código del producto
 *  nombre: Nombre del producto
 *  categoria: Categoría del producto
 *  cantidad: Cantidad actual en stock
 *  unidad: Unidad de medida (kg, litros, unidades)
 *  stockMinimo: Límite mínimo de stock para alerta
 *  nombreProveedor: Nombre del proveedor (desde módulo Proveedores)
 *  precioUnidad: Precio por unidad (puede ser null)
 *  fechaCaducidad: Fecha de caducidad en formato dd/mm/aaaa
 *
 * Validaciones:
 * No aplica validación de campos aquí (se realiza en el formulario que
 * consume este servicio). El manejo de valores nulos (como precioUnidad)
 * se realiza en la capa de presentación (TarjetaProducto).
 * 
 * Navegación:
 * No aplica, es una capa de datos sin UI.
 *
 * Dependencias:
 * Instancia de Axios (src/api/api.js)
 * Es consumido por hooks/useInventario.js.
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
