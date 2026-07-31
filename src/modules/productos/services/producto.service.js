import api from "../../../api/api";

export const productoService = {

  getProductos: async () => {
    try {
      const response = await api.get("/productos");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getProductoPorId: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  },

  // CORREGIDO: Se cambia de api.put('/productos/:id/activo') a api.delete('/productos/:id')
  desactivarProducto: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },


  buscarProductosPorNombre: async (nombre) => {
    try {
      const response = await api.get("/productos", { params: { nombre } });
      return response.data.data;
    } catch (error) {
      throw error;
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