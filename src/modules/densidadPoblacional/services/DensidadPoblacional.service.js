/**
 * ============================================================
 * SERVICE DENSIDADPOBLACIONAL.SERVICE
 * ============================================================
 *
 * Conecta el módulo de Densidad Poblacional con el backend real
 * (Express + MySQL) usando axios, en vez de AsyncStorage.
 *
 * Endpoint base: /densidad-poblacional (definido en app.js del
 * backend como /api/v0/densidad-poblacional, y api.js ya apunta
 * a EXPO_PUBLIC_API_URL que debe incluir ese prefijo /api/v0).
 *
 * Funcionalidad:
 * - getAll(filtros): retorna todos los registros activos.
 *   Acepta filtros opcionales { idFinca, idEstanque, grupoDatos }.
 * - getById(id): retorna un registro por su id.
 * - create(registro): crea un registro nuevo, mapeando los
 *   nombres de campo que arma useDensidadPoblacional.js
 *   (finca, estanque, supervivencia, siembraPorM2, ...) a los
 *   nombres reales de la tabla densidad_poblacional (idFinca,
 *   idEstanque, sobrevivencia, cantidadSiembra, ...).
 * - update(id, registro): actualiza un registro existente.
 * - deleteById(id): elimina lógicamente un registro (activo=false).
 *
 * Importante:
 * - Este archivo NO valida los datos que recibe: la validación de
 *   campos obligatorios ocurre antes, en useDatosConteo.validar()
 *   y en useDensidadPoblacional.validarPrincipal(). El backend
 *   además valida de nuevo y puede responder 400/422/409; esos
 *   errores se propagan tal cual (error.response.data).
 * - No calcula el campo "densidad": la tabla lo permite NULL y
 *   el backend no exige un valor. Si el negocio define una
 *   fórmula (ej. promedioPorTiro / areaAtarraya), se puede
 *   agregar aquí más adelante.
 * - Mantiene la misma forma pública (getAll/create/deleteById)
 *   que usaba con AsyncStorage, para no tener que tocar
 *   useDensidadPoblacional.js más de lo necesario.
 *
 * Ejemplo:
 * await densidadPoblacionalService.create(registro);
 */

import api from "../../../api/api";

/*
Convierte valores numéricos del formulario.
Si el valor es "", null o undefined retorna undefined.
*/
function numero(valor) {
    return valor === "" || valor == null
        ? undefined
        : Number(valor);
}

/*
Convierte el objeto "registro" que arma useDensidadPoblacional.js
a los campos reales que espera el backend
(dtos/densidadPoblacional.dto.js).
*/
function aBody(registro) {
    return {
        idFinca: registro.finca,
        idEstanque: registro.estanque,
        fecha: registro.fecha,
        cantidadSiembra: numero(registro.siembraPorM2),
        areaEstanque: numero(registro.areaEstanque),
        numeroCamarones: numero(registro.numeroCamarones),
        tirosAtarraya: numero(registro.tirosAtarraya),
        areaAtarraya: numero(registro.areaAtarraya),
        promedioPorTiro: numero(registro.promedioPorTiro),
        sobrevivencia: numero(registro.supervivencia),
        notasConteo: registro.notasConteo || undefined,
    };
}

/*
Convierte un registro devuelto por el backend (camelCase, con
idFinca/idEstanque/sobrevivencia/cantidadSiembra) a la forma que
ya usaba la pantalla, agregando alias (finca/estanque/
supervivencia/siembraPorM2) sin quitar los nombres reales.
*/
function aFrontend(registro) {
    if (!registro) return registro;

    return {
        ...registro,
        finca: registro.idFinca,
        estanque: registro.idEstanque,
        supervivencia: registro.sobrevivencia,
        siembraPorM2: registro.cantidadSiembra,
    };
}

const densidadPoblacionalService = {
    getAll: async (filtros = {}) => {
        const response = await api.get(
            "/densidad-poblacional",
            { params: filtros }
        );

        return (response.data.data || []).map(aFrontend);
    },

    getById: async (id) => {
        const response = await api.get(
            `/densidad-poblacional/${id}`
        );

        return aFrontend(response.data.data);
    },

    create: async (registro) => {
        const response = await api.post(
            "/densidad-poblacional",
            aBody(registro)
        );

        return aFrontend(response.data.data);
    },

    update: async (id, registro) => {
        const response = await api.put(
            `/densidad-poblacional/${id}`,
            aBody(registro)
        );

        return aFrontend(response.data.data);
    },

    deleteById: async (id) => {
        const response = await api.delete(
            `/densidad-poblacional/${id}`
        );

        return aFrontend(response.data.data);
    },
};

export default densidadPoblacionalService;