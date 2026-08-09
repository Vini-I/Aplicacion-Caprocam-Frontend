/**
 * ============================================================
 * SERVICE DE ENFERMEDADES
 * ============================================================
 *
 * Centraliza las peticiones HTTP del modulo de enfermedades.
 * Los datos de sesion y grupo de datos se obtienen desde el JWT.
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

/*
OBTENER TODAS LAS ENFERMEDADES
*/

async function getAll(filtros = {}) {
  try {
    const response = await api.get("/enfermedades", { params: filtros });
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener enfermedades");
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
    throw construirErrorHttp(error, "Error al obtener la enfermedad");
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
    throw construirErrorHttp(error, "Error al crear la enfermedad");
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
    throw construirErrorHttp(error, "Error al actualizar la enfermedad");
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
    throw construirErrorHttp(error, "Error al eliminar la enfermedad");
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
    throw construirErrorHttp(error, "Error al obtener el resumen de enfermedades");
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
    throw construirErrorHttp(error, "Error al obtener el catalogo de enfermedades");
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
    throw construirErrorHttp(error, "Error al obtener el catalogo de severidades");
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