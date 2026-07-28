// Catálogo local de fincas/estanques, igual que tiposProducto en
// proveedor.service.js.
//
// finca.service.js (getFincas) ya existe y trae datos reales del
// backend, pero se dejó pendiente de migrar aquí porque
// estanque.service.js (getEstanques) todavía no filtra por finca -
// trae todos los estanques sin relación a una finca específica, así
// que habría que filtrar en el cliente de todas formas. Se decidió
// esperar a que el equipo de Estanque agregue ese filtro (o exponer
// finca_id en la respuesta) antes de migrar ambos catálogos juntos,
// para no dejar Siembra usando una mezcla de datos reales (finca) y
// mock (estanque) a medio camino.
//
// TEMPORAL: valores de prueba insertados a mano en la BD local
// (grupo_datos = 1) para poder probar el flujo de Siembra de punta
// a punta contra el backend real, mientras tanto.
const estanquesPorFinca = {
  1: [
    { label: "EST-001", value: 2, areaHectareas: 0.8 },
  ],
};

export function obtenerFincas() {
  return [
    { label: "Finca Prueba", value: 1 },
  ];
}

export function obtenerEstanquesPorFinca(finca) {
  return estanquesPorFinca[finca] || [];
}

export function obtenerEstanquePorCodigo(finca, codigoEstanque) {
  return obtenerEstanquesPorFinca(finca).find((e) => e.value === codigoEstanque);
}