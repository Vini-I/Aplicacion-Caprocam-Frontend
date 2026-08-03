/**
 * ============================================================
 * SERVICE DE PARASITOLOGIA
 * ============================================================
 *
 * Centraliza las peticiones HTTP del modulo de parasitologia.
 * El token JWT se agrega automaticamente desde api.js.
 */

import api from "../../../api/api";

async function getAll() {
  try {
    const response = await api.get("/parasitologias");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener parasitologias", error.response?.data || error.message);
    throw error;
  }
}

async function getById(id) {
  try {
    const response = await api.get(`/parasitologias/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener la parasitologia", error.response?.data || error.message);
    throw error;
  }
}

async function create(parasitologiaDTO) {
  try {
    const response = await api.post("/parasitologias", parasitologiaDTO);
    return response.data.data;
  } catch (error) {
    console.error("Error al crear la parasitologia", error.response?.data || error.message);
    throw error;
  }
}

async function update(id, parasitologiaDTO) {
  try {
    const response = await api.put(`/parasitologias/${id}`, parasitologiaDTO);
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar la parasitologia", error.response?.data || error.message);
    throw error;
  }
}

async function deleteById(id) {
  try {
    const response = await api.delete(`/parasitologias/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al eliminar la parasitologia", error.response?.data || error.message);
    throw error;
  }
}

async function getResumenDashboard() {
  try {
    const response = await api.get("/parasitologias/resumen");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener el resumen de parasitologias", error.response?.data || error.message);
    throw error;
  }
}

async function getCatalogo() {
  try {
    const response = await api.get("/parasitologias/catalogo");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener el catalogo de parasitos", error.response?.data || error.message);
    throw error;
  }
}

const parasitologiaService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
  getResumenDashboard,
  getCatalogo,
};

export default parasitologiaService;