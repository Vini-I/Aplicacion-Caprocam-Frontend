/**
 * ============================================================
 * SERVICE DE PARASITOLOGIA
 * ============================================================
 *
 * Centraliza las peticiones HTTP del modulo de parasitologia.
 * El token JWT se agrega automaticamente desde api.js.
 */

import api from "../../../api/api";

function construirErrorHttp(error, mensajeGenerico) {
  const status = error?.response?.status;
  const mensaje = error?.response?.data?.message || error?.response?.data?.error || error?.message;

  if (status === 500) {
    return new Error(mensajeGenerico);
  }
  
  if (status) {
    const err = new Error(mensaje || mensajeGenerico);
    err.status = status;
    return err;
  }

  return new Error(mensajeGenerico);
}

async function getAll() {
  try {
    const response = await api.get("/parasitologias");
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener parasitologias");
  }
}

async function getById(id) {
  try {
    const response = await api.get(`/parasitologias/${id}`);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener la parasitologia");
  }
}

async function create(parasitologiaDTO) {
  try {
    const response = await api.post("/parasitologias", parasitologiaDTO);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al crear la parasitologia");
  }
}

async function update(id, parasitologiaDTO) {
  try {
    const response = await api.put(`/parasitologias/${id}`, parasitologiaDTO);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al actualizar la parasitologia");
  }
}

async function deleteById(id) {
  try {
    const response = await api.delete(`/parasitologias/${id}`);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al eliminar la parasitologia");
  }
}

async function getResumenDashboard() {
  try {
    const response = await api.get("/parasitologias/resumen");
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener el resumen de parasitologias");
  }
}

async function getCatalogo() {
  try {
    const response = await api.get("/parasitologias/catalogo");
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener el catalogo de parasitos");
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