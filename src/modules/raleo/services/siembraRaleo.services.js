/**
 * ============================================================
 * SERVICE SIEMBRA RALEO
 * ============================================================
 *
 * Servicio auxiliar del módulo Raleo.
 *
 * Consulta información de siembras necesarias para registrar
 * un raleo.
 *
 * No modifica el módulo Siembra.
 * ============================================================
 */

import api from "../../../api/api";


/**
 * ============================================================
 * OBTENER SIEMBRA ACTIVA POR ESTANQUE
 * ============================================================
 *
 * Consulta la siembra activa asociada a un estanque.
 *
 * Endpoint backend:
 * GET /api/v0/siembras/activa?idEstanque={id}
 *
 * Retorna:
 * {
 *   id: idSiembra,
 *   idEstanque,
 *   ...
 * }
 *
 */
export const getSiembraActivaPorEstanque = async (idEstanque) => {
try {
    const response = await api.get(`/siembras/activa?estanqueId=${idEstanque}`);
    return response.data.data;
} catch (error) {
    console.error(
    "Error al obtener siembra activa:",error.response?.data || error.message);
    throw error;
}
};
const siembraRaleoService = {
    getSiembraActivaPorEstanque
};
export default siembraRaleoService;