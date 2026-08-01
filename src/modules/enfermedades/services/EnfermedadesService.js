/**
 * ============================================================
 * SERVICE DE ENFERMEDADES
 * ============================================================
 *
 * Centraliza las peticiones HTTP del modulo de enfermedades.
 * Los datos de sesion y grupo de datos se obtienen desde el JWT.
 */

import api from "../../../api/api";

/*
OBTENER TODAS LAS ENFERMEDADES
*/

async function getAll(filtros = {}) {
  try {
    const response = await api.get("/enfermedades", { params: filtros });
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener enfermedades", error.response?.data || error.message);
    throw error;
  }
}

/*
OBTENER UNA ENFERMEDAD POR ID
*/

async function getById(id) {
  try {
    const response = await api.get(`/enfermedades/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener la enfermedad", error.response?.data || error.message);
    throw error;
  }
}

/*
CREAR UNA ENFERMEDAD
*/

async function create(enfermedadDTO) {
  try {
    const response = await api.post("/enfermedades", enfermedadDTO);
    return response.data.data;
  } catch (error) {
    console.error("Error al crear la enfermedad", error.response?.data || error.message);
    throw error;
  }
}

/*
ACTUALIZAR UNA ENFERMEDAD
*/

async function update(id, enfermedadDTO) {
  try {
    const response = await api.put(`/enfermedades/${id}`, enfermedadDTO);
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar la enfermedad", error.response?.data || error.message);
    throw error;
  }
}

/*
ELIMINAR UNA ENFERMEDAD
*/

async function deleteById(id) {
  try {
    const response = await api.delete(`/enfermedades/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al eliminar la enfermedad", error.response?.data || error.message);
    throw error;
  }
}

/*
OBTENER RESUMEN DE ENFERMEDADES
*/

async function getResumenDashboard(filtros = {}) {
  try {
    const response = await api.get("/enfermedades/resumen", { params: filtros });
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener el resumen de enfermedades", error.response?.data || error.message);
    throw error;
  }
}

/*
OBTENER CATALOGO DE ENFERMEDADES
*/

async function getCatalogo() {
  try {
    const response = await api.get("/enfermedades/catalogos/enfermedades");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener el catalogo de enfermedades", error.response?.data || error.message);
    throw error;
  }
}

/*
OBTENER CATALOGO DE SEVERIDADES
*/

async function getCatalogoSeveridades() {
  try {
    const response = await api.get("/enfermedades/catalogos/severidades");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener el catalogo de severidades", error.response?.data || error.message);
    throw error;
  }
}

const enfermedadesService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
  getResumenDashboard,
  getCatalogo,
  getCatalogoSeveridades,
};

export default enfermedadesService;