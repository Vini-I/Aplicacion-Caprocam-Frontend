import api from "../../../api/api";

/**
 * ============================================================
 * SERVICIO DE LOTE DE LARVA (backend real)
 * ============================================================
 *
 * Conecta el módulo de Lote de Larva con el backend real
 * (routes/loteLarva.routes.js). Reemplaza la parte de
 * SiembraService.js que manejaba lotes en memoria.
 *
 * El Lote de Larva siempre se crea primero, antes de una Siembra
 * o Pre-Cría, porque ambas dependen de su id (lote_larva_id)
 */

/*
OBTENER TODOS LOS LOTES DE LARVA
*/
export const getLotes = async () => {
  try {
    const response = await api.get("/lotes-larva");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener lotes de larva:", error);
    throw error;
  }
};

/*
OBTENER UN LOTE DE LARVA POR ID
*/
export const getLoteById = async (id) => {
  try {
    const response = await api.get(`/lotes-larva/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener lote de larva:", error);
    throw error;
  }
};

/*
CREAR UN LOTE DE LARVA
*/
export const createLote = async (loteDTO) => {
  try {
    const response = await api.post("/lotes-larva", loteDTO);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al crear lote de larva:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/*
ACTUALIZAR UN LOTE DE LARVA
*/
export const updateLote = async (id, loteDTO) => {
  try {
    const response = await api.put(`/lotes-larva/${id}`, loteDTO);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al actualizar lote de larva:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/*
ELIMINAR (DESACTIVAR) UN LOTE DE LARVA
*/
export const eliminarLote = async (id) => {
  try {
    const response = await api.delete(`/lotes-larva/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al eliminar lote de larva:",
      error.response?.data || error.message,
    );
    throw error;
  }
};