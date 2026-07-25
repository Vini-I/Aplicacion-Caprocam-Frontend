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

/*
Convierte el "form" que arma useRaleo.js/RaleoScreen.jsx a los
campos reales que espera el backend (dtos/raleo.dto.js).
*/
function aBody(form) {
    return {
        idFinca: form.finca,
        idEstanque: form.estanque,
        fecha: form.fecha,
        porcentaje: form.porcentajeRaleo,
        pesoEstimado: form.pesoPromedio !== "" ? Number(form.pesoPromedio) : undefined,
        biomasaEstimada: form.biomasaActual !== "" ? Number(form.biomasaActual) : undefined,
        objetivo: form.objetivo,
        metodo: form.metodo,
        responsable: form.responsable || undefined,
        observaciones: form.observaciones || undefined,
    };
}

/*
Convierte un raleo devuelto por el backend (camelCase, con
idFinca/idEstanque/porcentaje/pesoEstimado/biomasaEstimada) a la
forma que ya usaba la pantalla, agregando alias (finca/estanque/
porcentajeRaleo/pesoPromedio/biomasaActual) sin quitar los
nombres reales.
*/
function aFrontend(registro) {
    if (!registro) return registro;
    return {
        ...registro,
        finca: registro.idFinca,
        estanque: registro.idEstanque,
        porcentajeRaleo: registro.porcentaje,
        pesoPromedio: registro.pesoEstimado,
        biomasaActual: registro.biomasaEstimada,
    };
}

const raleoService = {
    getAll: async (filtros = {}) => {
        try {
            const response = await api.get("/raleo", { params: filtros });
            return (response.data.data || []).map(aFrontend);
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/raleo/${id}`);
            return aFrontend(response.data.data);
        } catch (error) {
            throw error;
        }
    },

    create: async (form) => {
        try {
            const response = await api.post("/raleo", aBody(form));
            return aFrontend(response.data.data);
        } catch (error) {
            throw error;
        }
    },

    update: async (id, form) => {
        try {
            const response = await api.put(`/raleo/${id}`, aBody(form));
            return aFrontend(response.data.data);
        } catch (error) {
            throw error;
        }
    },

    deleteById: async (id) => {
        try {
            const response = await api.delete(`/raleo/${id}`);
            return aFrontend(response.data.data);
        } catch (error) {
            throw error;
        }
    },
};

export default raleoService;
