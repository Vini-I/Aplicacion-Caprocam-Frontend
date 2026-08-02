import api from "../../../api/api";

async function getAll() {
  try {
    const response = await api.get("/crecimiento");
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al obtener crecimientos",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function getById(id) {
  try {
    const response = await api.get(`/crecimiento/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al obtener el crecimiento",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function create(crecimientoDTO) {
  try {
    const response = await api.post("/crecimiento", crecimientoDTO);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al crear el crecimiento",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function update(id, crecimientoDTO) {
  try {
    const response = await api.put(`/crecimiento/${id}`, crecimientoDTO);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al actualizar el crecimiento",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function deleteById(id) {
  try {
    const response = await api.delete(`/crecimiento/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al eliminar el crecimiento",
      error.response?.data || error.message
    );
    throw error;
  }
}

const crecimientoService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default crecimientoService;