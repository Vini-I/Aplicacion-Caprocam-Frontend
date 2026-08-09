/**
 * ============================================================
 * SERVICE RALEO.SERVICE
 * ============================================================
 *
 * Conecta el módulo de Raleo con el backend real (Express +
 * MySQL) usando axios.
 *
 * Endpoint base: /raleo (definido en app.js del backend como
 * /api/v0/raleo, y api.js ya apunta a EXPO_PUBLIC_API_URL que
 * debe incluir ese prefijo /api/v0).
 *
 * Corregido: antes apuntaba a `/raleos` (con "s"), que no existe
 * en el backend (mount real es `/api/v0/raleo`, sin "s") — todas
 * las llamadas daban 404. También devolvía `respuesta.data`
 * (el sobre completo { success, message, data }) en vez de
 * `respuesta.data.data` (el payload real), igual que corrigieron
 * los otros services (Alimentacion/DensidadPoblacional).
 *
 * Importante:
 * - Este archivo NO valida ni mapea nombres de campo: es un
 *   passthrough puro (mismo patrón que los otros 2 services).
 *   La validación ocurre en useRaleo.validarForm(), y el mapeo de
 *   nombres de campo (finca -> idFinca, etc.) ocurre en
 *   RaleoScreen.jsx antes de llamar a create()/update().
 *
 * Ejemplo:
 * await raleoService.create(raleoDTO);
 */

import api from "../../../api/api.js";

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
    const response = await api.get("/raleo");
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener los raleos");
  }
}

async function getById(id) {
  try {
    const response = await api.get(`/raleo/${id}`);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al obtener el raleo");
  }
}

async function create(raleoDTO) {
  try {
    const response = await api.post("/raleo", raleoDTO);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al crear el raleo");
  }
}

async function update(id, raleoDTO) {
  try {
    const response = await api.put(`/raleo/${id}`, raleoDTO);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al actualizar el raleo");
  }
}

async function deleteById(id) {
  try {
    const response = await api.delete(`/raleo/${id}`);
    return response.data.data;
  } catch (error) {
    throw construirErrorHttp(error, "Error al eliminar el raleo");
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
