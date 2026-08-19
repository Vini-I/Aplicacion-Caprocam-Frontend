/*
============================================================
SERVICIO DE RALEO
============================================================

Conecta el módulo de Raleo con el backend real.

El backend responde:
{
    success,
    message,
    data
}
*/

import api from "../../../api/api";

async function getAll() {
  try {
    const response = await api.get("/raleo");
   return response.data.data;
  } catch(error) {
    throw error;
  }
};

async function getById(id) {
  try {
    const response = await api.get(`/raleo/${id}`);
    return response.data.data;
  } catch(error) {
  throw error;
  }
};

async function create(raleoDTO) {
    try {
    const response = await api.post("/raleo", raleoDTO);
    return response.data.data;
  } catch(error) {
    throw error;
  }
};

async function update(id, raleoDTO) {
  try {
    const response = await api.put(`/raleo/${id}`, raleoDTO);
    return response.data.data;
  } catch(error) {
    throw error;
  }
};

async function deleteById(id) {
  try {
    const response = await api.delete(`/raleo/${id}`);
    return response.data.data;
  } catch(error) {
    throw error;
    }
};

const raleoService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default raleoService;