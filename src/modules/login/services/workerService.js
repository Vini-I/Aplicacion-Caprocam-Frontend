/**
 * ============================================================
 * WORKER SERVICE
 * ============================================================
 *
 * Obtiene datos de trabajadores/colaboradores desde la API real.
 * ============================================================
 */

import api from "../../../api/api";

const roles = {
    caprocam_collab: "Colaborador CAPROCAM",
    external_owner: "Propietario",
    external_collab: "Colaborador Externo"
};

const mapColaborador = (colaborador) => ({
    id: String(colaborador.id),
    initials: `${colaborador.nombre.charAt(0)}${colaborador.apellidos.charAt(0)}`,
    name: `${colaborador.nombre} ${colaborador.apellidos}`,
    role: roles[colaborador.tipoColaborador] ?? colaborador.tipoColaborador
});

/**
 * getWorkers()
 * Retorna la lista de trabajadores desde la API.
 */
export const getWorkers = async () => {
    const response = await api.get("/login/sincronizar");
    return response.data.data.map(mapColaborador);
};

/**
 * getWorkerById(id)
 * Obtiene un trabajador específico por su ID.
 *
 * NOTA: si tu backend tiene GET /colaboradores/:id, reemplaza esto por
 * una llamada directa (más eficiente). Por ahora reutiliza getWorkers().
 */
export const getWorkerById = async (id) => {
    const workers = await getWorkers();
    return workers.find((w) => w.id === String(id)) || null;
};