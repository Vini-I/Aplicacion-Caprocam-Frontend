/**
 * ============================================================
 * SERVICE RALEO.SERVICE
 * ============================================================
 *
 * Conecta el módulo de Raleo con el backend real (Express +
 * MySQL) usando axios, en vez de AsyncStorage.
 *
 * Endpoint base: /raleo (definido en app.js del backend como
 * /api/v0/raleo, y api.js ya apunta a EXPO_PUBLIC_API_URL que
 * debe incluir ese prefijo /api/v0).
 *
 * Funcionalidad:
 * - getAll(filtros): retorna todos los raleos activos.
 *   Acepta filtros opcionales { idFinca, idEstanque, grupoDatos }.
 * - getById(id): retorna un raleo por su id.
 * - create(form): crea un raleo nuevo, mapeando los nombres de
 *   campo del formulario (finca, estanque, porcentajeRaleo,
 *   pesoPromedio, biomasaActual, ...) a los nombres reales de la
 *   tabla raleos (idFinca, idEstanque, porcentaje, pesoEstimado,
 *   biomasaEstimada, ...).
 * - update(id, form): actualiza un raleo existente.
 * - deleteById(id): elimina lógicamente un raleo (activo=false).
 *
 * Importante:
 * - Este archivo NO valida los datos que recibe: la validación de
 *   campos obligatorios ocurre antes, en useRaleo.validarForm().
 *   El backend además valida de nuevo (incluye el enum de
 *   `metodo`) y puede responder 400/422/409; esos errores se
 *   propagan tal cual (error.response.data).
 * - Mantiene la misma forma pública (getAll/create/deleteById)
 *   que usaba con AsyncStorage, para no tener que tocar
 *   RaleoScreen.jsx más de lo necesario.
 *
 * Ejemplo:
 * await raleoService.create(form);
 */

import api from "../../../api/api.js";

const raleoService = {
    getAll: async () => {
        const respuesta = await api.get(`/raleos`);
        return respuesta.data;
    },

    getById: async (id) => {
        const respuesta = await api.get(`/raleos/${id}`);
        return respuesta.data;
    },

    create: async (registro) => {
        const respuesta = await api.post(`/raleos`, registro);
        return respuesta.data;
    },

    deleteById: async (id) => {
        const respuesta = await api.delete(`/raleos/${id}`)
        return respuesta.data;
    },
};

export default raleoService;
