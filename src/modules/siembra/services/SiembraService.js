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
 *
 * NOTA - CATÁLOGOS DE LARVA (proveedor / laboratorio / procedencia):
 * Antes eran arrays fijos sin forma de agregarles nada desde la app.
 * Ahora agregarProveedorLarva/agregarLaboratorioLarva/agregarProcedenciaLarva
 * permiten sumar un ítem nuevo a esos catálogos (lo usa el modal de
 * "Agregar nuevo" que aparece junto a esos Select en DatosLarvaSection).
 *
 * NOTA - PRE-CRÍA -> SIEMBRA:
 * obtenerPreCriasFinalizadasDisponibles() y mapearPreCriaASiembra()
 * centralizan cómo se traspasan los datos de una Pre-Cría finalizada
 * hacia una Siembra nueva, para que el botón "Registrar Siembra" (desde
 * el Detalle de una Pre-Cría) y el Select "Siembra a partir de Pre-Cría"
 * (en Nueva Siembra) usen exactamente la misma lógica.
 */
const siembras = [
  {
    siembraId: 26,
    finca: "La Reina",
    fincaId: "laReina",
    estanque: "A02",
    fechaSiembra: "20/06/2026",
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

/**
 * Pre-Crías finalizadas que todavía NO tienen una Siembra creada
 * a partir de ellas (para el Select "Siembra a partir de Pre-Cría").
 * Se recalcula siempre a partir del array vivo, así que cualquier
 * Pre-Cría recién finalizada aparece automáticamente disponible.
 */
export function obtenerPreCriasFinalizadasDisponibles() {
  const idsYaUsados = new Set(
    siembras
      .filter(
        (registro) => registro.tipoRegistro !== "precria" && registro.precriaId,
      )
      .map((registro) => Number(registro.precriaId)),
  );

  return siembras
    .filter(
      (registro) =>
        registro.tipoRegistro === "precria" &&
        registro.estado === "Finalizada" &&
        !idsYaUsados.has(registro.siembraId),
    )
    .map((registro) => ({
      label: `Pre-Cría #${registro.siembraId}`,
      value: String(registro.siembraId),
    }));
}

export function mapearPreCriaASiembra(precria) {
  if (!precria) {
    return {};
  }

  return {
    finca: precria.fincaId || precria.finca || "",
    estanque: precria.estanque || "",
    cantidadSobrevivientePrecria:
      precria.cantidadSobrevivientePrecria || precria.cantidadFinal || "",
    duracionPrecria: precria.duracionPrecria || precria.duracionDias || "",
    fechaSalidaPrecria: precria.fechaSalidaPrecria || precria.fechaFin || "",
    proveedorLarva: precria.proveedorLarva || "",
    laboratorioLarva: precria.laboratorioLarva || "",
    procedenciaLarva: precria.procedenciaLarva || "",
    codigoLoteLarva: precria.codigoLoteLarva || "",
    certificadoLarva: precria.certificadoLarva || "",
    plSiembra: precria.plLarva || precria.plFinal || precria.plInicial || "",
  };
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

const proveedoresLarva = [
  { label: "Larvas del Pacífico", value: "pacifico" },
  { label: "AquaLarva", value: "aqua" },
  { label: "Maricultura CR", value: "maricultura" },
];

const laboratoriosLarva = [
  { label: "Laboratorio Pacífico Norte", value: "pacificoNorte" },
  { label: "AquaLab Costa Rica", value: "aqualabCr" },
  { label: "MarLarva Guanacaste", value: "marlarvaGuanacaste" },
];

const procedenciasLarva = [
  { label: "Puntarenas", value: "puntarenas" },
  { label: "Golfo de Nicoya", value: "golfoNicoya" },
  { label: "Laboratorio nacional", value: "laboratorioNacional" },
  { label: "Importada", value: "importada" },
];

function generarValorDesdeNombre(lista, nombre) {
  const base = nombre
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let value = base || "item";
  let contador = 1;

  while (lista.some((opcion) => opcion.value === value)) {
    contador += 1;
    value = `${base}-${contador}`;
  }

  return value;
}

export function obtenerProveedoresLarva() {
  return [...proveedoresLarva];
}

export function obtenerLaboratoriosLarva() {
  return [...laboratoriosLarva];
}

export function obtenerProcedenciasLarva() {
  return [...procedenciasLarva];
}

export function agregarProveedorLarva(nombre) {
  const nuevaOpcion = {
    label: nombre.trim(),
    value: generarValorDesdeNombre(proveedoresLarva, nombre),
  };
  proveedoresLarva.push(nuevaOpcion);
  return nuevaOpcion;
}

export function agregarLaboratorioLarva(nombre) {
  const nuevaOpcion = {
    label: nombre.trim(),
    value: generarValorDesdeNombre(laboratoriosLarva, nombre),
  };
  laboratoriosLarva.push(nuevaOpcion);
  return nuevaOpcion;
}

export function agregarProcedenciaLarva(nombre) {
  const nuevaOpcion = {
    label: nombre.trim(),
    value: generarValorDesdeNombre(procedenciasLarva, nombre),
  };
  procedenciasLarva.push(nuevaOpcion);
  return nuevaOpcion;
}

export function actualizarProveedorLarva(value, nombre) {
  const opcion = proveedoresLarva.find((item) => item.value === value);
  if (!opcion) return null;
  opcion.label = nombre.trim();
  return { ...opcion };
}

export function actualizarLaboratorioLarva(value, nombre) {
  const opcion = laboratoriosLarva.find((item) => item.value === value);
  if (!opcion) return null;
  opcion.label = nombre.trim();
  return { ...opcion };
}

export function actualizarProcedenciaLarva(value, nombre) {
  const opcion = procedenciasLarva.find((item) => item.value === value);
  if (!opcion) return null;
  opcion.label = nombre.trim();
  return { ...opcion };
}

export function eliminarProveedorLarva(value) {
  const indice = proveedoresLarva.findIndex((item) => item.value === value);
  if (indice === -1) return false;
  proveedoresLarva.splice(indice, 1);
  return true;
}

export function eliminarLaboratorioLarva(value) {
  const indice = laboratoriosLarva.findIndex((item) => item.value === value);
  if (indice === -1) return false;
  laboratoriosLarva.splice(indice, 1);
  return true;
}

export function eliminarProcedenciaLarva(value) {
  const indice = procedenciasLarva.findIndex((item) => item.value === value);
  if (indice === -1) return false;
  procedenciasLarva.splice(indice, 1);
  return true;
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
