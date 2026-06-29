/**
 * Servicio temporal para gestionar las siembras.
 * Posteriormente deberá conectarse con la base de datos o API.
 */

const siembras = [
  {
    siembraId: 25,
    finca: "La Reina",
    fincaId: "laReina",
    estanque: "A01",
    fechaSiembra: "03/06/2026",
    horaIngreso: "08:30",
    diasCultivo: 2,
    diasMaduracion: "90",

    proveedorLarva: "pacifico",
    laboratorioLarva: "pacifico_norte",
    procedenciaLarva: "puntarenas",
    codigoLoteLarva: "LARV-2026-001",
    plLarva: "PL12",
    certificadoLarva: "CERT-2026-001",

    pasoPorPrecria: "si",
    duracionPrecria: "15",
    fechaSalidaPrecria: "20/06/2026",
    cantidadSobrevivientePrecria: "210000",

    areaHectareas: "1.87",
    densidadPoblacional: "12",
    cantidadSembrada: "224400",

    areaEstanque: "1.87 ha",
    densidad: "12 PL/m²",
    tecnicaCultivo: "semi",
    especie: "Litopenaeus vannamei",
    produccionEstimada: "4,050 kg",
    estado: "Activa",
  },
  {
    siembraId: 26,
    finca: "La Reina",
    fincaId: "laReina",
    estanque: "A02",
    fechaSiembra: "20/06/2026",
    horaIngreso: "07:45",
    diasCultivo: 18,
    diasMaduracion: "90",

    proveedorLarva: "aqua",
    laboratorioLarva: "aqualab_cr",
    procedenciaLarva: "golfo_nicoya",
    codigoLoteLarva: "LARV-2026-002",
    plLarva: "PL10",
    certificadoLarva: "CERT-2026-002",

    pasoPorPrecria: "no",
    duracionPrecria: "",
    fechaSalidaPrecria: "",
    cantidadSobrevivientePrecria: "",

    areaHectareas: "1.50",
    densidadPoblacional: "12",
    cantidadSembrada: "180000",

    areaEstanque: "1.50 ha",
    densidad: "12 PL/m²",
    tecnicaCultivo: "semi",
    especie: "Litopenaeus vannamei",
    produccionEstimada: "3,240 kg",
    estado: "Activa",
  },
  {
    siembraId: 27,
    finca: "La Reina",
    fincaId: "laReina",
    estanque: "B01",
    fechaSiembra: "01/07/2026",
    horaIngreso: "06:30",
    diasCultivo: 10,
    diasMaduracion: "90",

    proveedorLarva: "maricultura",
    laboratorioLarva: "marlarva_guanacaste",
    procedenciaLarva: "laboratorio_nacional",
    codigoLoteLarva: "LARV-2026-003",
    plLarva: "PL8",
    certificadoLarva: "CERT-2026-003",

    pasoPorPrecria: "si",
    duracionPrecria: "12",
    fechaSalidaPrecria: "30/06/2026",
    cantidadSobrevivientePrecria: "140000",

    areaHectareas: "1.20",
    densidadPoblacional: "12",
    cantidadSembrada: "144000",

    areaEstanque: "1.20 ha",
    densidad: "12 PL/m²",
    tecnicaCultivo: "semi",
    especie: "Litopenaeus vannamei",
    produccionEstimada: "2,600 kg",
    estado: "Activa",
  },
  {
    siembraId: 28,
    finca: "La Reina",
    fincaId: "laReina",
    estanque: "B02",
    fechaSiembra: "12/07/2026",
    horaIngreso: "09:00",
    diasCultivo: 5,
    diasMaduracion: "90",

    proveedorLarva: "pacifico",
    laboratorioLarva: "pacifico_norte",
    procedenciaLarva: "puntarenas",
    codigoLoteLarva: "LARV-2026-004",
    plLarva: "PL9",
    certificadoLarva: "CERT-2026-004",

    pasoPorPrecria: "no",
    duracionPrecria: "",
    fechaSalidaPrecria: "",
    cantidadSobrevivientePrecria: "",

    areaHectareas: "1.25",
    densidadPoblacional: "8",
    cantidadSembrada: "100000",

    areaEstanque: "1.25 ha",
    densidad: "8 PL/m²",
    tecnicaCultivo: "semi",
    especie: "Litopenaeus vannamei",
    produccionEstimada: "2,700 kg",
    estado: "Activa",
  },
];

const estanquesPorFinca = {
  laReina: [
    { label: "A01", value: "A01", areaHectareas: 1.87 },
    { label: "A02", value: "A02", areaHectareas: 1.5 },
    { label: "B01", value: "B01", areaHectareas: 1.2 },
    { label: "B02", value: "B02", areaHectareas: 1.25 },
    { label: "B03", value: "B03", areaHectareas: 2 },
  ],
  laEsperanza: [
    { label: "E01", value: "E01", areaHectareas: 2.3 },
    { label: "E02", value: "E02", areaHectareas: 1.75 },
  ],
  laVilla: [
    { label: "V01", value: "V01", areaHectareas: 1.1 },
    { label: "V02", value: "V02", areaHectareas: 1.6 },
    { label: "V03", value: "V03", areaHectareas: 2.4 },
  ],
};

export function obtenerSiembras() {
  return siembras;
}

export function obtenerSiembraPorId(siembraId) {
  return siembras.find((siembra) => siembra.siembraId === siembraId);
}

export function obtenerFincas() {
  return [
    { label: "Finca La Reina", value: "laReina" },
    { label: "Finca La Esperanza", value: "laEsperanza" },
    { label: "Finca La Villa", value: "laVilla" },
  ];
}

export function obtenerEstanquesPorFinca(finca) {
  return estanquesPorFinca[finca] || [];
}

export function obtenerEstanquePorCodigo(finca, codigoEstanque) {
  const estanques = obtenerEstanquesPorFinca(finca);

  return estanques.find((estanque) => estanque.value === codigoEstanque);
}

export function obtenerProveedoresLarva() {
  return [
    { label: "Larvas del Pacífico", value: "pacifico" },
    { label: "AquaLarva", value: "aqua" },
    { label: "Maricultura CR", value: "maricultura" },
  ];
}

export function obtenerLaboratoriosLarva() {
  return [
    { label: "Laboratorio Pacífico Norte", value: "pacifico_norte" },
    { label: "AquaLab Costa Rica", value: "aqualab_cr" },
    { label: "MarLarva Guanacaste", value: "marlarva_guanacaste" },
  ];
}

export function obtenerProcedenciasLarva() {
  return [
    { label: "Puntarenas", value: "puntarenas" },
    { label: "Golfo de Nicoya", value: "golfo_nicoya" },
    { label: "Laboratorio nacional", value: "laboratorio_nacional" },
    { label: "Importada", value: "importada" },
  ];
}

export function obtenerTecnicasCultivo() {
  return [
    { label: "Extensiva", value: "extensiva" },
    { label: "Semi-intensiva", value: "semi" },
    { label: "Intensiva", value: "intensiva" },
  ];
}

export function obtenerPLLarva() {
  return Array.from({ length: 12 }, (_, index) => {
    const pl = index + 1;

    return {
      label: `PL${pl}`,
      value: `PL${pl}`,
    };
  });
}
export function obtenerOpcionesPrecria() {
  return [
    { label: "No", value: "no" },
    { label: "Sí", value: "si" },
  ];
}