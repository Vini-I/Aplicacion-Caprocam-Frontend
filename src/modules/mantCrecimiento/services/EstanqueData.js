/**
 * ============================================================
 * DATOS DE ESTANQUES DEL MÓDULO DE CRECIMIENTO
 * ============================================================
 *
 * Contiene la información de referencia para los estanques usados
 * en la pantalla de peso y crecimiento.
 */

export const estanques = [
  {
    id: 1,
    codigo: "A01",
    nombre: "Estanque A01",
    fincaId: 1,
    fincaNombre: "Finca La Esperanza",
    area: 1.25,
    diasCultivo: 94,
    estado: "activo",
    pesoSemanaAnterior: 268,
  },
  {
    id: 2,
    codigo: "A02",
    nombre: "Estanque A02",
    fincaId: 1,
    fincaNombre: "Finca La Esperanza",
    area: 1.4,
    diasCultivo: 80,
    estado: "activo",
    pesoSemanaAnterior: 240,
  },
  {
    id: 3,
    codigo: "B01",
    nombre: "Estanque B01",
    fincaId: 2,
    fincaNombre: "Finca El Paraíso",
    area: 1.1,
    diasCultivo: 0,
    estado: "preparación",
    pesoSemanaAnterior: 0,
  },
  {
    id: 4,
    codigo: "B02",
    nombre: "Estanque B02",
    fincaId: 2,
    fincaNombre: "Finca El Paraíso",
    area: 1.35,
    diasCultivo: 120,
    estado: "cosechado",
    pesoSemanaAnterior: 150,
  },
];

export function searchEstanqueById(id) {
  return estanques.find((estanque) => estanque.id === id);
}
