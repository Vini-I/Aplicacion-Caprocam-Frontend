import api from "../../../api/api";

/**
 * ============================================================
 * SERVICIO DE PROCEDENCIA DE LARVA (backend real)
 * ============================================================
 *
 * Conecta el catálogo de procedencias con el backend real
 * (routes/procedencia.routes.js). Reemplaza el catálogo en
 * memoria que tenía SiembraService.js (agregarProcedenciaLarva,
 * actualizarProcedenciaLarva, eliminarProcedenciaLarva).
 *
 */

/*
OBTENER TODAS LAS PROCEDENCIAS
*/
export const getProcedencias = async () => {
  try {
    const response = await api.get("/procedencias");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener procedencias:", error);
    throw error;
  }
};

/*
CREAR UNA PROCEDENCIA (usado por el modal "Agregar nuevo")
*/
export const createProcedencia = async (nombre) => {
  try {
    const response = await api.post("/procedencias", { nombre });
    return response.data.data;
  } catch (error) {
    console.error("Error al crear procedencia:", error.response?.data || error.message);
    throw error;
  }
};

/*
ACTUALIZAR EL NOMBRE DE UNA PROCEDENCIA
*/
export const updateProcedencia = async (id, nombre) => {
  try {
    const response = await api.put(`/procedencias/${id}`, { nombre });
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar procedencia:", error.response?.data || error.message);
    throw error;
  }
};

/*
ELIMINAR (DESACTIVAR) UNA PROCEDENCIA
*/
export const eliminarProcedencia = async (id) => {
  try {
    const response = await api.delete(`/procedencias/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al eliminar procedencia:", error.response?.data || error.message);
    throw error;
  }
};