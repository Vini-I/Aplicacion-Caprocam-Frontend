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
