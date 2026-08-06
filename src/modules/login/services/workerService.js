/**
 * SERVICIO: workerService
 * Consulta y transforma la lista de colaboradores/trabajadores desde la API REST backend.
 *
 * @dependencies - api (api/api.js)
 * @validations  - Transforma los campos del colaborador (id, iniciales, nombre, rol).
 * @navigation   - N/A
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
 */
export const getWorkerById = async (id) => {
    const workers = await getWorkers();
    return workers.find((w) => w.id === String(id)) || null;
};