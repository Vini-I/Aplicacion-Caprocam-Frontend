import api from "../../../api/api";

function construirErrorHttp(error, mensajeGenerico) {
  const status = error?.response?.status;
  const mensaje = error?.response?.data?.message || error?.response?.data?.error || error?.message;

  if (status) {
    const err = new Error(mensaje || mensajeGenerico);
    err.status = status;
    return err;
  }

  return new Error(mensajeGenerico);
}

async function getAll() {
  try {
    const response = await api.get("/crecimiento");
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 500 || error.response?.status === 409) {
      throw error;
    }
    throw new Error("No se pudieron obtener los registros de crecimiento.");
  }
}

async function getById(id) {
  try {
    const response = await api.get(`/crecimiento/${id}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 500 || error.response?.status === 409) {
      throw error;
    }
    throw new Error("No se pudo obtener el registro de crecimiento.");
  }
}

async function create(crecimientoDTO) {
  try {
    const response = await api.post("/crecimiento", crecimientoDTO);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 500 || error.response?.status === 400 || error.response?.status === 409) {
      throw construirErrorHttp(error, "No se pudo registrar el crecimiento.");
    }
    throw new Error("No se pudo registrar el crecimiento.");
  }
}

async function update(id, crecimientoDTO) {
  try {
    const response = await api.put(`/crecimiento/${id}`, crecimientoDTO);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 500 || error.response?.status === 400 || error.response?.status === 409) {
      throw construirErrorHttp(error, "No se pudo actualizar el crecimiento.");
    }
    throw new Error("No se pudo actualizar el crecimiento.");
  }
}

async function deleteById(id) {
  try {
    const response = await api.delete(`/crecimiento/${id}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 500 || error.response?.status === 409) {
      throw error;
    }
    throw new Error("No se pudo eliminar el crecimiento.");
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