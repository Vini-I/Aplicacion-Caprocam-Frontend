import api from "../../../api/api";

/**
 * ============================================================
 * SERVICIO DE PROVEEDOR DE LARVA (backend real)
 * ============================================================
 *
 * Conecta el catálogo de proveedores de larva con el backend
 * real (routes/proveedorLarva.routes.js). Reemplaza el catálogo
 * en memoria que tenía SiembraService.js (agregarProveedorLarva,
 * actualizarProveedorLarva, eliminarProveedorLarva).
 *
 * Distinto al proveedor "general" del módulo de Proveedores: este
 * es su propio catálogo (tabla proveedores_larva), solo usado por
 * Lote de Larva - no comparte tabla ni endpoint con /proveedores.
 */

/*
OBTENER TODOS LOS PROVEEDORES DE LARVA
*/
export const getProveedoresLarva = async () => {
  try {
    const response = await api.get("/proveedores-larva");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener proveedores de larva:", error);
    throw error;
  }
};

/*
CREAR UN PROVEEDOR DE LARVA (usado por el modal "Agregar nuevo")
*/
export const createProveedorLarva = async (nombre) => {
  try {
    const response = await api.post("/proveedores-larva", { nombre });
    return response.data.data;
  } catch (error) {
    console.error("Error al crear proveedor de larva:", error.response?.data || error.message);
    throw error;
  }
};

/*
ACTUALIZAR EL NOMBRE DE UN PROVEEDOR DE LARVA
*/
export const updateProveedorLarva = async (id, nombre) => {
  try {
    const response = await api.put(`/proveedores-larva/${id}`, { nombre });
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar proveedor de larva:", error.response?.data || error.message);
    throw error;
  }
};

/*
ELIMINAR (DESACTIVAR) UN PROVEEDOR DE LARVA
*/
export const eliminarProveedorLarva = async (id) => {
  try {
    const response = await api.delete(`/proveedores-larva/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al eliminar proveedor de larva:", error.response?.data || error.message);
    throw error;
  }
};