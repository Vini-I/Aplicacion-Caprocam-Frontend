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

/*
Convierte los campos del formulario del frontend a los campos
reales que espera el backend (dtos/alimentacion.dto.js).
*/
function aBody(form) {
    return {
        idFinca: form.finca,
        idEstanque: form.estanque,
        fecha: form.fecha,
        hora: form.hora,
        metodo: form.metodo,
        cantidadKg: form.cantidadKg !== "" ? Number(form.cantidadKg) : undefined,
        presentacion: form.presentacion || undefined,
        proveedor: form.proveedor || undefined,
        tipoAlimento: form.tipoAlimento || undefined,
        observaciones: form.observaciones || undefined,
    };
}

/*
Convierte un registro devuelto por el backend (camelCase, con
idFinca/idEstanque numéricos) a la forma que ya usaban las
pantallas (con alias finca/estanque), para no romper componentes
como AlimentacionStats/AlimentacionList que leen esos nombres.
*/
function aFrontend(registro) {
    if (!registro) return registro;
    return {
        ...registro,
        finca: registro.idFinca,
        estanque: registro.idEstanque,
    };
}

const alimentacionService = {
    getAll: async (filtros = {}) => {
        const response = await api.get("/alimentaciones", { params: filtros });
        return (response.data.data || []).map(aFrontend);
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/alimentaciones/${id}`);
            return aFrontend(response.data.data);
        } catch (error) {
            throw error;
        }
    },

    create: async (form) => {
        try {
            const response = await api.post("/alimentaciones", aBody(form));
            return aFrontend(response.data.data);
        } catch (error) {
            throw error;
        }
    },

    update: async (id, form) => {
        try {
            const response = await api.put(`/alimentaciones/${id}`, aBody(form));
            return aFrontend(response.data.data);
        } catch (error) {
            throw error;
        }
    },

    deleteById: async (id) => {
        try {
            const response = await api.delete(`/alimentaciones/${id}`);
            return aFrontend(response.data.data);
        } catch (error) {
            throw error;
        }
    },
};
export default alimentacionService;