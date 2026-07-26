import api from "../../../api/api";

/**
 * ============================================================
 * SERVICIO: ESTANQUES POR FINCA (para el módulo de Siembra)
 * ============================================================
 *
 * Consume el endpoint de Estanque (GET /estanques?idFinca=) para
 * traer los estanques filtrados por finca. Se usa en
 * useNuevaSiembra, useDetalleSiembra y useSiembraList.
 *
 * Mapea cada estanque a {label, value, areaHectareas}.
 */

export async function getEstanquesPorFinca(idFinca) {
  try {
    const response = await api.get("/estanques", {
      params: idFinca ? { idFinca } : {},
    });

    return response.data.data.map((estanque) => ({
      label: estanque.codigo,
      value: estanque.id,
      areaHectareas: (estanque.largo * estanque.ancho) / 10000,
    }));
  } catch (error) {
    throw error;
  }
}