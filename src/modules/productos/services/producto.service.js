/**
 * ============================================================
 * SERVICE: PRODUCTOSERVICE
 * ============================================================
 * Módulo: Productos
 *
 * Conexión a la API de productos (CRUD contra /productos).
 *
 * FUNCIONALIDAD:
 * 1. getProductos / getProductoPorId: lectura de productos.
 * 2. crearProducto / actualizarProducto: alta y edición.
 * 3. desactivarProducto: baja lógica (DELETE /productos/:id).
 * 4. buscarProductosPorNombre: búsqueda por nombre.
 * 5. mapProducto: normaliza la respuesta cruda del back al shape
 *    que usan las pantallas del módulo.
 *
 * ============================================================
 */

import api from "../../../api/api";

/**
 * ============================================================
 * MANEJO DE ERRORES DE ESTE SERVICE
 * ============================================================
 * Mismo patrón acordado en equipo que en comprador.service.js (ver
 * Explicación ModalError): si el back devuelve un status
 * "controlado" (con un mensaje real y útil, ej. 404 "Producto no
 * encontrado"), dejamos pasar el error tal cual (throw error) para
 * que el mensaje real del back llegue hasta mostrarError(). Para
 * cualquier otro status armamos un mensaje genérico propio de la
 * acción que falló.
 * ============================================================
 */
function esErrorControlado(error, statusEsperados) {
  return statusEsperados.includes(error.response?.status);
}

export const productoService = {

  getProductos: async () => {
    try {
      const response = await api.get("/productos");
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [500])) throw error;
      throw new Error("No se pudieron obtener los productos.");
    }
  },

  getProductoPorId: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [404, 500])) throw error;
      throw new Error("No se pudo obtener el producto.");
    }
  },


  crearProducto: async (datos) => {
    try {
      const response = await api.post("/productos", {
        codigo: datos.codigo,
        nombre: datos.nombre,
        categoria: datos.categoria,
        unidad: datos.unidad,
        precioUnidad: datos.precioUnidad,
        cantidad: datos.cantidad,
        stockMinimo: datos.stockMinimo,
        proveedorId: datos.proveedorId ?? null,
        entryDate: datos.entryDate || null,
        expirationDate: datos.expirationDate || null,
      });
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [400, 500])) throw error;
      throw new Error("No se pudo crear el producto.");
    }
  },

  actualizarProducto: async (id, datos) => {
    try {
      const response = await api.put(`/productos/${id}`, {
        codigo: datos.codigo,
        nombre: datos.nombre,
        categoria: datos.categoria,
        unidad: datos.unidad,
        precioUnidad: datos.precioUnidad,
        cantidad: datos.cantidad,
        stockMinimo: datos.stockMinimo,
        proveedorId: datos.proveedorId ?? null,
        entryDate: datos.entryDate || null,
        expirationDate: datos.expirationDate || null,
      });
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [400, 404, 500])) throw error;
      throw new Error("No se pudo actualizar el producto.");
    }
  },

  // CORREGIDO: Se cambia de api.put('/productos/:id/activo') a api.delete('/productos/:id')
  desactivarProducto: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [404, 500])) throw error;
      throw new Error("No se pudo eliminar el producto.");
    }
  },


  buscarProductosPorNombre: async (nombre) => {
    try {
      const response = await api.get("/productos", { params: { nombre } });
      return response.data.data;
    } catch (error) {
      if (esErrorControlado(error, [500])) throw error;
      throw new Error("No se pudieron buscar productos.");
    }
  },
};


export function mapProducto(apiProducto) {
  if (!apiProducto) return null;
  return {
    id: apiProducto.id,
    codigo: apiProducto.codigo ?? "",
    nombre: apiProducto.nombre ?? "",
    categoria: apiProducto.categoria ?? "",
    proveedor: apiProducto.proveedor ?? "",
    proveedorId: apiProducto.proveedorId ?? null,
    cantidad: apiProducto.cantidad ?? 0,
    unidad: apiProducto.unidad ?? "",
    stockMinimo: apiProducto.stockMinimo ?? 0,
    precioUnidad: apiProducto.precioUnidad ?? 0,
    entryDate: apiProducto.entryDate ?? "",
    expirationDate: apiProducto.expirationDate ?? "",
  };
}