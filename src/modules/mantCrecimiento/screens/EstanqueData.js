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
  },
];

export function searchEstanqueById(id) {
  return estanques.find((estanque) => estanque.id === id);
}
