/**
 * ============================================================
 * SERVICIO: fincaService
 * ============================================================
 * Módulo: Colaboradores
 *
 * Responsabilidad:
 * - Obtener la lista de fincas disponibles para asociar a un colaborador.
 * - Conecta con el backend real (GET /fincas) o usa fallback local.
 *
 * Dependencias:
 * - api (axios) desde src/api/api.js
 * ============================================================
 */

import api from "../../../api/api";

// Fallback local en caso de que la ruta falle o no haya conexión
const FINCAS_FALLBACK = [
  { id: 1, nombreFinca: "Finca El Maragal" },
  { id: 2, nombreFinca: "Finca Costa Azul" },
  { id: 3, nombreFinca: "Finca Camaronera Golfo" },
  { id: 4, nombreFinca: "Finca Los Manglares" },
  { id: 5, nombreFinca: "Finca El Paraíso" },
];

/**
 * Obtiene la lista de fincas desde el backend.
 * Si falla, devuelve el fallback local.
 *
 * @param {number} grupoDatos - Grupo de datos del usuario (opcional)
 * @returns {Promise<Array<{id: number, nombreFinca: string}>>}
 */
export const getFincas = async (grupoDatos) => {
  try {
    const response = await api.get("/fincas");
    const data = response.data.data || [];

    // El backend devuelve: { id, nombreFinca, codigoCBO, provincia, ... }
    // Solo necesitamos id y nombreFinca para el select
    return data.map((finca) => ({
      id: finca.id,
      nombreFinca: finca.nombreFinca || `Finca ${finca.id}`,
    }));
  } catch (error) {
    console.warn("Error al obtener fincas desde el backend, usando fallback:", error.message);
    return FINCAS_FALLBACK;
  }
};

/**
 * Obtiene las fincas formateadas para el componente <Select>.
 * Retorna { label: nombreFinca, value: id }
 */
export const getFincasOptions = async (grupoDatos) => {
  const fincas = await getFincas(grupoDatos);
  return fincas.map((finca) => ({
    label: finca.nombreFinca,
    value: finca.id,
  }));
};