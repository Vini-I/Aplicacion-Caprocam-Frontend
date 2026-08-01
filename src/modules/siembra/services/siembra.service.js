import api from "../../../api/api";

/**
 * ============================================================
 * SERVICIO DE SIEMBRA (backend real)
 * ============================================================
 *
 * Conecta el módulo de Siembra con el backend real
 * (routes/siembra.route.js). Reemplaza la parte de
 * SiembraService.js que manejaba siembras en memoria.
 *
 * El backend responde siempre con { success, message, data }..
 */

/*
OBTENER TODAS LAS SIEMBRAS
*/
export const getSiembras = async () => {
  try {
    const response = await api.get("/siembras");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener siembras:", error);
    throw error;
  }
};

/*
OBTENER UNA SIEMBRA POR ID
*/
export const getSiembraById = async (id) => {
  try {
    const response = await api.get(`/siembras/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener siembra:", error);
    throw error;
  }
};

/*
CREAR UNA SIEMBRA
*/
export const createSiembra = async (siembraDTO) => {
  try {
    const response = await api.post("/siembras", siembraDTO);
    return response.data.data;
  } catch (error) {
    console.error("Error al crear siembra:", error.response?.data || error.message);
    throw error;
  }
};

/*
ACTUALIZAR UNA SIEMBRA
*/
export const updateSiembra = async (id, siembraDTO) => {
  try {
    const response = await api.put(`/siembras/${id}`, siembraDTO);
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar siembra:", error.response?.data || error.message);
    throw error;
  }
};

/*
FINALIZAR UNA SIEMBRA (marca el ciclo como cerrado, sin body)
*/
export const finalizarSiembra = async (id) => {
  try {
    const response = await api.post(`/siembras/${id}/finalizar`);
    return response.data.data;
  } catch (error) {
    console.error("Error al finalizar siembra:", error.response?.data || error.message);
    throw error;
  }
};

/*
ELIMINAR (DESACTIVAR) UNA SIEMBRA
*/
export const eliminarSiembra = async (id) => {
  try {
    const response = await api.delete(`/siembras/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al eliminar siembra:", error.response?.data || error.message);
    throw error;
  }
};