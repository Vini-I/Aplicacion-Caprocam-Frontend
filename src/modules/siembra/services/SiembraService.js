/**
 * ============================================================
 * SERVICIO DE SIEMBRA
 * ============================================================
 *
 * Gestiona temporalmente la información utilizada por el módulo
 * de Siembra mediante datos simulados en memoria.
 *
 * FUNCIONALIDAD:
 * - Proporciona registros de siembras existentes.
 * - Consulta siembras por identificador.
 * - Obtiene catálogos de fincas, estanques y datos de larva.
 * - Proporciona opciones utilizadas en los formularios.
 *
 * NOTA:
 * Actualmente utiliza información local de prueba.
 * Posteriormente deberá conectarse con la base de datos.
 */
const siembras = [
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
    laboratorioLarva: "aqualabCr",
    procedenciaLarva: "golfoNicoya",
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
    siembraId: 30,
    tipoRegistro: "precria",
    finca: "La Esperanza",
    fincaId: "laEsperanza",
    estanque: "E01",
    fechaInicio: "05/07/2026",
    fechaFin: "",
    diasCultivo: 3,
    diasMaduracion: "15",
    duracionDias: "15",

    proveedorLarva: "aqua",
    laboratorioLarva: "aqualabCr",
    procedenciaLarva: "golfoNicoya",
    codigoLoteLarva: "PREC-2026-002",
    certificadoLarva: "CERT-PREC-002",

    cantidadInicial: "300000",
    cantidadFinal: "",
    plInicial: "PL6",
    plFinal: "",

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

const listeners = new Set();

function notificarCambios() {
  listeners.forEach((listener) => listener(obtenerSiembras()));
}

export function subscribeToSiembras(callback) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}

export function obtenerSiembras() {
  return siembras.map((siembra) => ({ ...siembra }));
}

export function obtenerSiembraPorId(siembraId) {
  const siembra = siembras.find(
    (registro) => registro.siembraId === Number(siembraId),
  );

  return siembra ? { ...siembra } : undefined;
}

function obtenerSiguienteId() {
  const ids = siembras.map((registro) => registro.siembraId || 0);
  const maximo = ids.length ? Math.max(...ids) : 0;
  return maximo + 1;
}

export function crearRegistro(formData) {
  const nuevoRegistro = {
    ...formData,
    siembraId: obtenerSiguienteId(),
    diasCultivo: 0,
    estado: formData.estado || "Activa",
  };

  siembras.push(nuevoRegistro);
  notificarCambios();

  return nuevoRegistro;
}

export function actualizarSiembra(siembraId, formData) {
  const indice = siembras.findIndex(
    (registro) => registro.siembraId === Number(siembraId),
  );

  if (indice === -1) {
    return null;
  }

  const registroActualizado = {
    ...siembras[indice],
    ...formData,
    siembraId: siembras[indice].siembraId,
  };

  siembras[indice] = registroActualizado;
  notificarCambios();

  return registroActualizado;
}

/**
 * Finaliza una Pre-Cría: persiste los datos editados y fuerza
 * el estado a "Finalizada".
 */
export function finalizarPreCria(siembraId, formData) {
  return actualizarSiembra(siembraId, { ...formData, estado: "Finalizada" });
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
    { label: "Laboratorio Pacífico Norte", value: "pacificoNorte" },
    { label: "AquaLab Costa Rica", value: "aqualabCr" },
    { label: "MarLarva Guanacaste", value: "marlarvaGuanacaste" },
  ];
}

export function obtenerProcedenciasLarva() {
  return [
    { label: "Puntarenas", value: "puntarenas" },
    { label: "Golfo de Nicoya", value: "golfoNicoya" },
    { label: "Laboratorio nacional", value: "laboratorioNacional" },
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