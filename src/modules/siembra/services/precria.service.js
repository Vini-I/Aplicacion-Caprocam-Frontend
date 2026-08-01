import api from "../../../api/api";

/**
 * ============================================================
 * SERVICIO DE PRE-CRÍA (backend real)
 * ============================================================
 *
 * Conecta el módulo de Pre-Cría con el backend real
 * (routes/preCria.routes.js). Reemplaza la parte de
 * SiembraService.js que manejaba pre-crías en memoria.
 *
 * finalizarPrecria() es aparte de updatePrecria() porque el
 * backend tiene un endpoint dedicado (POST /precrias/:id/finalizar)
 * que solo acepta 3 campos de cierre (fecha_fin, cantidad_final,
 * pl_final) - no se puede finalizar mandando un PUT normal.
 */

/*
OBTENER TODAS LAS PRE-CRÍAS
*/
export const getPrecrias = async () => {
  try {
    const response = await api.get("/precrias");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener pre-crías:", error);
    throw error;
  }
};

/*
OBTENER UNA PRE-CRÍA POR ID
*/
export const getPrecriaById = async (id) => {
  try {
    const response = await api.get(`/precrias/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener pre-cría:", error);
    throw error;
  }
};

/*
CREAR UNA PRE-CRÍA
*/
export const createPrecria = async (precriaDTO) => {
  try {
    const response = await api.post("/precrias", precriaDTO);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al crear pre-cría:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/*
ACTUALIZAR UNA PRE-CRÍA
*/
export const updatePrecria = async (id, precriaDTO) => {
  try {
    const response = await api.put(`/precrias/${id}`, precriaDTO);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al actualizar pre-cría:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/*
FINALIZAR UNA PRE-CRÍA (endpoint dedicado, solo cierre del ciclo)
*/
export const finalizarPrecria = async (id, finalizarPrecriaDTO) => {
  try {
    const response = await api.post(
      `/precrias/${id}/finalizar`,
      finalizarPrecriaDTO,
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al finalizar pre-cría:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/*
ELIMINAR (DESACTIVAR) UNA PRE-CRÍA
*/
export const eliminarPrecria = async (id) => {
  try {
    const response = await api.delete(`/precrias/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al eliminar pre-cría:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
