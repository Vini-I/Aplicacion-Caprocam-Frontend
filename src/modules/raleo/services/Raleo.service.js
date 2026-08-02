/**
 * ============================================================
 * SERVICE RALEO.SERVICE
 * ============================================================
 *
 * Persiste los registros de raleo en AsyncStorage bajo la clave
 * "raleos_v1". Sigue exactamente el mismo patrón que
 * Alimentacion.service.js.
 *
 * Funcionalidad:
 * - getAll(): retorna todos los registros guardados.
 * - create(registro): agrega un registro nuevo con id y timestamp.
 * - deleteById(id): elimina un registro por id.
 * - clearAll(): elimina todos los registros guardados.
 *
 * Importante:
 * - Este archivo NO valida los datos que recibe: la validación
 *   de campos obligatorios ocurre antes, en useRaleo.validarForm().
 *
 * Ejemplo:
 * await raleoService.create(form);
 */
import api from "../../../api/api.js";

async function getAll() {
  try {
    const response = await api.get("/raleo");
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al obtener los raleos",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function getById(id) {
  try {
    const response = await api.get(`/raleo/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al obtener el raleo",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function create(raleoDTO) {
  try {
    const response = await api.post("/raleo", raleoDTO);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al crear el raleo",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function update(id, raleoDTO) {
  try {
    const response = await api.put(`/raleo/${id}`, raleoDTO);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al actualizar el raleo",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function deleteById(id) {
  try {
    const response = await api.delete(`/raleo/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al eliminar el raleo",
      error.response?.data || error.message
    );
    throw error;
  }
}

const raleoService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default raleoService;