/**
 * ============================================================
 * SERVICE ALIMENTACION.SERVICE
 * ============================================================
 *
 * Conecta el módulo de Alimentación con el backend real
 * (Express + MySQL) usando axios, en vez de AsyncStorage.
 *
 * Endpoint base: /alimentaciones (definido en app.js del backend
 * como /api/v0/alimentaciones, y api.js ya apunta a
 * EXPO_PUBLIC_API_URL que debe incluir ese prefijo /api/v0).
 *
 * Funcionalidad:
 * - getAll(filtros): retorna todos los registros activos.
 *   Acepta filtros opcionales { idFinca, idEstanque, grupoDatos }.
 * - getById(id): retorna un registro por su id.
 * - create(form): crea un registro nuevo, mapeando los nombres de
 *   campo del formulario (finca, estanque, cantidadKg, ...) a los
 *   nombres que espera el backend (idFinca, idEstanque, ...).
 * - update(id, form): actualiza un registro existente.
 * - deleteById(id): elimina lógicamente un registro (activo=false).
 *
 * Importante:
 * - Este archivo NO valida los datos que recibe: la validación de
 *   campos obligatorios ocurre antes, en useAlimentacionForm. El
 *   backend además valida de nuevo y puede responder 400/422/409;
 *   esos errores se propagan tal cual (error.response.data).
 * - Mantiene la misma forma pública (getAll/create/deleteById) que
 *   usaban las screens con AsyncStorage, para no tener que tocar
 *   useAlimentacion.js ni las screens.
 *
 * Ejemplo:
 * await alimentacionService.create(form);
 */

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
