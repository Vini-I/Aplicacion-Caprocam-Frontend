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
 * Cada producto: { id, codigo, nombre, categoria, cantidad, unidad,
 * stockMinimo, proveedor, precioUnidad, fechaCaducidad }.
 * fechaCaducidad ya existe como dato real del producto (se define y
 * se guarda desde el módulo de Productos); aquí solo se refleja para
 * que el filtro de "Fecha de caducidad" de FilterButton.jsx pueda
 * usarlo. Formato dd/mm/aaaa, igual al que entrega el DateInput
 * compartido.
 *
 * Validaciones:
 * No aplica validación de campos aquí (se realiza en el formulario que
 * consume este servicio). El id se autogenera de forma incremental.
 *
 * Navegación:
 * No aplica, es una capa de datos sin UI.
 *
 * Dependencias:
 * Es consumido por hooks/useInventario.js.
 */
import api from "../../../api/api";

export async function getProductosInventario() {
  try {
    const response = await api.get("/inventario");

    return response.data.data;
  } catch (error) {
    console.error("Error al obtener productos de inventario:", error);

    throw error;
  }
}

export async function getProductoById(id) {
  try {
    const response = await api.get(`/inventario/${id}`);

    return response.data.data;
  } catch (error) {
    console.error(
      "Error al obtener producto:",
      error.response?.data || error.message,
    );

    throw error;
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
    console.error(
      "Error al crear producto:",
      error.response?.data || error.message,
    );
    
    throw error;
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
    console.error(
      "Error al actualizar producto:",
      error.response?.data || error.message,
    );

    throw error;
  }
}

export async function deleteProducto(id) {
  try {
    const response = await api.delete(`/inventario/${id}`);

    return response.data;
  } catch (error) {
    console.error(
      "Error al eliminar producto:",
      error.response?.data || error.message,
    );

    throw error;
  }
}
