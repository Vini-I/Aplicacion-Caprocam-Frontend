//Service Alimentacion

import api from "../../../api/api";

async function getAll() {
  try {
    const response = await api.get("/alimentaciones");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener alimentaciones", error.response?.data || error.message);
    throw error;
  }
}

async function getById(id) {
  try {
    const response = await api.get(`/alimentaciones/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener la alimentación", error.response?.data || error.message);
    throw error;
  }
}

async function create(alimentacionDTO) {
  try {
    const response = await api.post("/alimentaciones", alimentacionDTO);
    return response.data.data;
  } catch (error) {
    console.error("Error al crear la alimentación", error.response?.data || error.message);
    throw error;
  }
}

async function update(id, alimentacionDTO) {
  try {
    const response = await api.put(`/alimentaciones/${id}`, alimentacionDTO);
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar la alimentación", error.response?.data || error.message);
    throw error;
  }
}

async function deleteById(id) {
  try {
    const response = await api.delete(`/alimentaciones/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al eliminar la alimentación", error.response?.data || error.message);
    throw error;
  }
}

const alimentacionService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default alimentacionService;