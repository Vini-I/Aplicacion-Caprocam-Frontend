/**
 * Servicio temporal para gestionar las siembras.
 * Posteriormente deberá conectarse con la base de datos o API.
 */

const siembras = [
  {
    siembraId: 25,
    estanque: "A01",
    finca: "La Reina",
    fechaSiembra: "03/06/2026",
    diasCultivo: 35,
    diasMaduracion: 90,
    cantidadSembrada: 225000,
    areaEstanque: "1.87 ha",
    densidad: "12 camarones/m²",
    certificadoLarva: "CERT-2026-001",
    tecnicaCultivo: "Semi-intensiva",
    especie: "Litopenaeus vannamei",
    produccionEstimada: "4,050 kg",
    estado: "Activa",
  },
  {
    siembraId: 26,
    estanque: "A02",
    finca: "La Reina",
    fechaSiembra: "20/06/2026",
    diasCultivo: 18,
    diasMaduracion: 90,
    cantidadSembrada: 225000,
    areaEstanque: "1.87 ha",
    densidad: "12 camarones/m²",
    certificadoLarva: "CERT-2026-002",
    tecnicaCultivo: "Semi-intensiva",
    especie: "Litopenaeus vannamei",
    produccionEstimada: "4,050 kg",
    estado: "Activa",
  },
  {
  siembraId: 27,
  estanque: "B01",
  finca: "La Reina",
  fechaSiembra: "01/07/2026",
  diasCultivo: 10,
  diasMaduracion: 90,
  cantidadSembrada: 180000,
  areaEstanque: "1.50 ha",
  densidad: "12 camarones/m²",
  certificadoLarva: "CERT-2026-003",
  tecnicaCultivo: "Semi-intensiva",
  especie: "Litopenaeus vannamei",
  produccionEstimada: "3,240 kg",
  estado: "Activa",
},
{
  siembraId: 28,
  estanque: "B02",
  finca: "La Reina",
  fechaSiembra: "12/07/2026",
  diasCultivo: 5,
  diasMaduracion: 90,
  cantidadSembrada: 150000,
  areaEstanque: "1.25 ha",
  densidad: "12 camarones/m²",
  certificadoLarva: "CERT-2026-004",
  tecnicaCultivo: "Semi-intensiva",
  especie: "Litopenaeus vannamei",
  produccionEstimada: "2,700 kg",
  estado: "Activa",
},
];

export function obtenerSiembras() {
  return siembras;
}

export function obtenerSiembraPorId(siembraId) {
  return siembras.find((siembra) => siembra.siembraId === siembraId);
}
