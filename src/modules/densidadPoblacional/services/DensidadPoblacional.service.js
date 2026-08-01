//Service DensidadPoblacional

import api from "../../../api/api";

async function getAll() {
  try {
    const response = await api.get("/densidad-poblacional");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener densidades poblacionales", error.response?.data || error.message);
    throw error;
  }
}

async function getById(id) {
  try {
    const response = await api.get(`/densidad-poblacional/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener la densidad poblacional", error.response?.data || error.message);
    throw error;
  }
}

async function create(densidadDTO) {
  try {
    const response = await api.post("/densidad-poblacional", densidadDTO);
    return response.data.data;
  } catch (error) {
    console.error("Error al crear la densidad poblacional", error.response?.data || error.message);
    throw error;
  }
}

async function update(id, densidadDTO) {
  try {
    const response = await api.put(`/densidad-poblacional/${id}`, densidadDTO);
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar la densidad poblacional", error.response?.data || error.message);
    throw error;
  }
}

async function deleteById(id) {
  try {
    const response = await api.delete(`/densidad-poblacional/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al eliminar la densidad poblacional", error.response?.data || error.message);
    throw error;
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