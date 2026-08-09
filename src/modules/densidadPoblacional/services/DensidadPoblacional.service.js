//Service DensidadPoblacional

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
    const response = await api.get("/densidad-poblacional");
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener densidades poblacionales");
  }
}

async function getById(id) {
  try {
    const response = await api.get(`/densidad-poblacional/${id}`);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener la densidad poblacional");
  }
}

async function create(densidadDTO) {
  try {
    const response = await api.post("/densidad-poblacional", densidadDTO);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al crear la densidad poblacional");
  }
}

async function update(id, densidadDTO) {
  try {
    const response = await api.put(`/densidad-poblacional/${id}`, densidadDTO);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al actualizar la densidad poblacional");
  }
}

async function deleteById(id) {
  try {
    const response = await api.delete(`/densidad-poblacional/${id}`);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al eliminar la densidad poblacional");
  }
}

const densidadPoblacionalService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default densidadPoblacionalService;