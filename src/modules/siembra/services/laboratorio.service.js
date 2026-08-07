import api from "../../../api/api";

/**
 * ============================================================
 * SERVICIO DE LABORATORIO DE LARVA (backend real)
 * ============================================================
 *
 * Conecta el catálogo de laboratorios con el backend real
 * (routes/laboratorio.routes.js). Reemplaza el catálogo en
 * memoria que tenía SiembraService.js (agregarLaboratorioLarva,
 * actualizarLaboratorioLarva, eliminarLaboratorioLarva).
 *
 */

/*
OBTENER TODOS LOS LABORATORIOS
*/
export const getLaboratorios = async () => {
  try {
    const response = await api.get("/laboratorios");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/*
CREAR UN LABORATORIO (usado por el modal "Agregar nuevo")
*/
export const createLaboratorio = async (nombre) => {
  try {
    const response = await api.post("/laboratorios", { nombre });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/*
ACTUALIZAR EL NOMBRE DE UN LABORATORIO
*/
export const updateLaboratorio = async (id, nombre) => {
  try {
    const response = await api.put(`/laboratorios/${id}`, { nombre });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/*
ELIMINAR (DESACTIVAR) UN LABORATORIO
*/
export const eliminarLaboratorio = async (id) => {
  try {
    const response = await api.delete(`/laboratorios/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};