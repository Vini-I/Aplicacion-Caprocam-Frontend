/**
 * ============================================================
 * SERVICE: ENFERMEDADES
 * ============================================================
 *
 * Descripcion:
 * Maneja la integracion Axios del modulo Enfermedades.
 *
 * Funcionalidad:
 * - Obtiene, crea, actualiza y elimina enfermedades.
 * - Obtiene catalogos de enfermedades y severidades.
 * - Obtiene fincas y estanques reales desde el backend.
 * - Agrega datos reales de respaldo solo para pruebas cuando
 *   el backend no devuelve alguno de esos registros.
 *
 * Importante:
 * - Los datos de respaldo no crean ni modifican registros.
 * - grupoDatos se obtiene desde el JWT.
 * - responsable se obtiene desde el JWT.
 * - colaboradorId se obtiene desde el JWT.
 * - tipoRegistro es controlado por el backend.
 */

import api from "../../../api/api";

/*
============================================================
RUTAS
============================================================
*/

const RUTA_ENFERMEDADES = "/enfermedades";
const RUTA_RESUMEN = "/enfermedades/resumen";

const RUTA_CATALOGO_ENFERMEDADES =
  "/enfermedades/catalogos/enfermedades";

const RUTA_CATALOGO_SEVERIDADES =
  "/enfermedades/catalogos/severidades";

const RUTA_FINCAS = "/fincas";
const RUTA_ESTANQUES = "/estanques";

/*
============================================================
DATOS REALES DE RESPALDO
============================================================

Estos registros corresponden a datos reales utilizados en las
pruebas del proyecto. Se agregan solo cuando Axios no devuelve
el registro correspondiente.

No se realiza ningun INSERT, UPDATE o DELETE en la base de datos.
*/

const FINCAS_RESPALDO = [
  {
    id: 1,
    codigoCBO: "1124",
    nombreFinca: "afadfas",
  },
  {
    id: 2,
    codigoCBO: "CBO-DEMO-DASH",
    nombreFinca: "Finca Demo Dashboard",
  },
];

const ESTANQUES_RESPALDO = [
  {
    id: 1,
    idFinca: 1,
    codigo: "123123",
    tipoEstanque: "reservorio",
    estado: "Activo",
  },
  {
    id: 2,
    idFinca: 2,
    codigo: "DEMO-P01",
    tipoEstanque: "Precria",
    estado: "En preparacion",
  },
  {
    id: 3,
    idFinca: 2,
    codigo: "DEMO-E01",
    tipoEstanque: "Engorde",
    estado: "Activo",
  },
];

/*
============================================================
RESPUESTAS
============================================================
*/

function obtenerDataRespuesta(response) {
  if (response === undefined || response === null) {
    return null;
  }

  if (response.data === undefined || response.data === null) {
    return null;
  }

  if (response.data.data !== undefined) {
    return response.data.data;
  }

  return response.data;
}

function obtenerListaRespuesta(response) {
  const data = obtenerDataRespuesta(response);

  if (Array.isArray(data) === true) {
    return data;
  }

  return [];
}

function obtenerTextoSeguro(valor, respaldo) {
  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ""
  ) {
    return respaldo;
  }

  return String(valor).trim();
}

function obtenerNumeroSeguro(valor) {
  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ""
  ) {
    return 0;
  }

  const texto = String(valor).replace(",", ".");
  const numero = Number(texto);

  if (Number.isNaN(numero) === true) {
    return 0;
  }

  return numero;
}

function obtenerPrimerValor(objeto, campos) {
  if (objeto === undefined || objeto === null) {
    return null;
  }

  for (let i = 0; i < campos.length; i++) {
    const campo = campos[i];
    const valor = objeto[campo];

    if (
      valor !== undefined &&
      valor !== null &&
      String(valor).trim() !== ""
    ) {
      return valor;
    }
  }

  return null;
}

function obtenerIdFinca(finca) {
  const valor = obtenerPrimerValor(
    finca,
    [
      "id",
      "fincaId",
      "finca_id",
      "idFinca",
    ],
  );

  return obtenerNumeroSeguro(valor);
}

function obtenerIdEstanque(estanque) {
  const valor = obtenerPrimerValor(
    estanque,
    [
      "id",
      "estanqueId",
      "estanque_id",
      "idEstanque",
    ],
  );

  return obtenerNumeroSeguro(valor);
}

function obtenerFincaIdEstanque(estanque) {
  const valor = obtenerPrimerValor(
    estanque,
    [
      "idFinca",
      "fincaId",
      "finca_id",
    ],
  );

  if (obtenerNumeroSeguro(valor) > 0) {
    return obtenerNumeroSeguro(valor);
  }

  if (
    estanque.finca !== undefined &&
    estanque.finca !== null &&
    typeof estanque.finca === "object"
  ) {
    return obtenerNumeroSeguro(estanque.finca.id);
  }

  return 0;
}

/*
============================================================
MEZCLA DE RESPALDOS
============================================================
*/

function agregarFincasRespaldo(fincasBackend) {
  const resultado = [];

  if (Array.isArray(fincasBackend) === true) {
    for (let i = 0; i < fincasBackend.length; i++) {
      resultado.push(fincasBackend[i]);
    }
  }

  for (let i = 0; i < FINCAS_RESPALDO.length; i++) {
    const respaldo = FINCAS_RESPALDO[i];
    let existe = false;

    for (let j = 0; j < resultado.length; j++) {
      if (
        obtenerIdFinca(resultado[j]) ===
        Number(respaldo.id)
      ) {
        existe = true;
        break;
      }
    }

    if (existe === false) {
      resultado.push(respaldo);
    }
  }

  return resultado;
}

function agregarEstanquesRespaldo(estanquesBackend) {
  const resultado = [];

  if (Array.isArray(estanquesBackend) === true) {
    for (let i = 0; i < estanquesBackend.length; i++) {
      resultado.push(estanquesBackend[i]);
    }
  }

  for (let i = 0; i < ESTANQUES_RESPALDO.length; i++) {
    const respaldo = ESTANQUES_RESPALDO[i];
    let existe = false;

    for (let j = 0; j < resultado.length; j++) {
      if (
        obtenerIdEstanque(resultado[j]) ===
        Number(respaldo.id)
      ) {
        existe = true;
        break;
      }
    }

    if (existe === false) {
      resultado.push(respaldo);
    }
  }

  return resultado;
}

/*
============================================================
FECHAS
============================================================
*/

export function convertirFechaBackend(valor) {
  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ""
  ) {
    return "";
  }

  if (valor instanceof Date) {
    const anio = valor.getFullYear();
    const mes = String(valor.getMonth() + 1).padStart(2, "0");
    const dia = String(valor.getDate()).padStart(2, "0");

    return anio + "-" + mes + "-" + dia;
  }

  const texto = String(valor).trim();
  const patronBackend = /^\d{4}-\d{2}-\d{2}$/;

  if (patronBackend.test(texto) === true) {
    return texto;
  }

  const patronFrontend = /^\d{2}\/\d{2}\/\d{4}$/;

  if (patronFrontend.test(texto) === true) {
    const partes = texto.split("/");

    return partes[2] + "-" + partes[1] + "-" + partes[0];
  }

  return texto.slice(0, 10);
}

export function convertirFechaFrontend(valor) {
  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ""
  ) {
    return "";
  }

  const texto = String(valor).slice(0, 10);
  const patronFrontend = /^\d{2}\/\d{2}\/\d{4}$/;

  if (patronFrontend.test(texto) === true) {
    return texto;
  }

  const patronBackend = /^\d{4}-\d{2}-\d{2}$/;

  if (patronBackend.test(texto) === true) {
    const partes = texto.split("-");

    return partes[2] + "/" + partes[1] + "/" + partes[0];
  }

  return texto;
}

/*
============================================================
ERRORES
============================================================
*/

export function obtenerMensajeError(error, respaldo) {
  let mensaje = respaldo;

  if (error === undefined || error === null) {
    return mensaje;
  }

  if (
    error.message !== undefined &&
    error.message !== null &&
    String(error.message).trim() !== ""
  ) {
    mensaje = String(error.message);
  }

  if (
    error.response === undefined ||
    error.response === null ||
    error.response.data === undefined ||
    error.response.data === null
  ) {
    return mensaje;
  }

  const data = error.response.data;

  if (
    data.message !== undefined &&
    data.message !== null &&
    String(data.message).trim() !== ""
  ) {
    mensaje = String(data.message);
  }

  if (Array.isArray(data.error) === true && data.error.length > 0) {
    mensaje = data.error.join("\n");
  }

  if (
    typeof data.error === "string" &&
    data.error.trim() !== ""
  ) {
    mensaje = data.error;
  }

  if (Array.isArray(data.errors) === true && data.errors.length > 0) {
    mensaje = data.errors.join("\n");
  }

  return mensaje;
}

/*
============================================================
PAYLOAD
============================================================
*/

export function construirPayloadEnfermedad(datos) {
  let mortalidadRegistrada = null;

  if (
    datos.mortalidadRegistrada !== undefined &&
    datos.mortalidadRegistrada !== null &&
    String(datos.mortalidadRegistrada).trim() !== ""
  ) {
    mortalidadRegistrada = obtenerNumeroSeguro(
      datos.mortalidadRegistrada,
    );
  }

  let reporte = null;

  if (
    datos.reporte !== undefined &&
    datos.reporte !== null &&
    String(datos.reporte).trim() !== ""
  ) {
    reporte = String(datos.reporte).trim();
  }

  return {
    fincaId: Number(datos.fincaId),
    estanqueId: Number(datos.estanqueId),
    fechaReporte: convertirFechaBackend(datos.fechaReporte),
    enfermedad: String(datos.enfermedad).trim(),
    severidad: String(datos.severidad).trim(),
    mortalidadRegistrada: mortalidadRegistrada,
    reporte: reporte,
  };
}

/*
============================================================
ADAPTADORES
============================================================
*/

export function adaptarEnfermedad(registro) {
  if (registro === undefined || registro === null) {
    return null;
  }

  const fincaId = obtenerPrimerValor(
    registro,
    [
      "fincaId",
      "finca_id",
      "idFinca",
    ],
  );

  const estanqueId = obtenerPrimerValor(
    registro,
    [
      "estanqueId",
      "estanque_id",
      "idEstanque",
    ],
  );

  const mortalidad = obtenerPrimerValor(
    registro,
    [
      "mortalidadRegistrada",
      "mortalidad_registrada",
      "mortalidad",
    ],
  );

  return {
    ...registro,
    id: obtenerNumeroSeguro(registro.id),
    fincaId: obtenerNumeroSeguro(fincaId),
    estanqueId: obtenerNumeroSeguro(estanqueId),
    fechaReporte: convertirFechaFrontend(registro.fechaReporte),
    responsable: obtenerTextoSeguro(
      registro.responsable,
      "No registrado",
    ),
    enfermedad: obtenerTextoSeguro(registro.enfermedad, ""),
    enfermedadNombre: obtenerTextoSeguro(
      registro.enfermedadNombre,
      registro.enfermedad,
    ),
    severidad: obtenerTextoSeguro(registro.severidad, ""),
    severidadNombre: obtenerTextoSeguro(
      registro.severidadNombre,
      registro.severidad,
    ),
    mortalidadRegistrada: obtenerNumeroSeguro(mortalidad),
    reporte: obtenerTextoSeguro(
      registro.reporte,
      "Sin observaciones",
    ),
  };
}

function adaptarListaEnfermedades(registros) {
  const resultado = [];

  if (Array.isArray(registros) === false) {
    return resultado;
  }

  for (let i = 0; i < registros.length; i++) {
    const registro = adaptarEnfermedad(registros[i]);

    if (registro !== null) {
      resultado.push(registro);
    }
  }

  return resultado;
}

function adaptarCatalogo(lista) {
  const resultado = [];

  if (Array.isArray(lista) === false) {
    return resultado;
  }

  for (let i = 0; i < lista.length; i++) {
    const item = lista[i];

    if (typeof item === "string") {
      resultado.push({
        label: item,
        value: item,
      });

      continue;
    }

    const valor = obtenerPrimerValor(
      item,
      [
        "value",
        "valor",
        "codigo",
      ],
    );

    const etiqueta = obtenerPrimerValor(
      item,
      [
        "label",
        "nombre",
        "value",
        "valor",
      ],
    );

    resultado.push({
      ...item,
      label: obtenerTextoSeguro(etiqueta, String(i)),
      value: obtenerTextoSeguro(valor, String(i)),
    });
  }

  return resultado;
}

/*
============================================================
CRUD
============================================================
*/

export async function obtenerEnfermedades(filtros) {
  const parametros = {};

  if (filtros !== undefined && filtros !== null) {
    if (
      filtros.fincaId !== undefined &&
      filtros.fincaId !== null &&
      String(filtros.fincaId).trim() !== ""
    ) {
      parametros.fincaId = filtros.fincaId;
    }

    if (
      filtros.estanqueId !== undefined &&
      filtros.estanqueId !== null &&
      String(filtros.estanqueId).trim() !== ""
    ) {
      parametros.estanqueId = filtros.estanqueId;
    }

    if (
      filtros.enfermedad !== undefined &&
      filtros.enfermedad !== null &&
      String(filtros.enfermedad).trim() !== ""
    ) {
      parametros.enfermedad = filtros.enfermedad;
    }

    if (
      filtros.severidad !== undefined &&
      filtros.severidad !== null &&
      String(filtros.severidad).trim() !== ""
    ) {
      parametros.severidad = filtros.severidad;
    }
  }

  const response = await api.get(
    RUTA_ENFERMEDADES,
    {
      params: parametros,
    },
  );

  return adaptarListaEnfermedades(
    obtenerListaRespuesta(response),
  );
}

export async function obtenerEnfermedadPorId(id) {
  const response = await api.get(
    RUTA_ENFERMEDADES + "/" + id,
  );

  return adaptarEnfermedad(
    obtenerDataRespuesta(response),
  );
}

export async function crearEnfermedad(datos) {
  const payload = construirPayloadEnfermedad(datos);

  const response = await api.post(
    RUTA_ENFERMEDADES,
    payload,
  );

  return adaptarEnfermedad(
    obtenerDataRespuesta(response),
  );
}

export async function actualizarEnfermedad(id, datos) {
  const payload = construirPayloadEnfermedad(datos);

  const response = await api.put(
    RUTA_ENFERMEDADES + "/" + id,
    payload,
  );

  return adaptarEnfermedad(
    obtenerDataRespuesta(response),
  );
}

export async function eliminarEnfermedad(id) {
  const response = await api.delete(
    RUTA_ENFERMEDADES + "/" + id,
  );

  return adaptarEnfermedad(
    obtenerDataRespuesta(response),
  );
}

/*
============================================================
RESUMEN
============================================================
*/

export async function obtenerResumenEnfermedades(filtros) {
  const parametros = {};

  if (filtros !== undefined && filtros !== null) {
    Object.assign(parametros, filtros);
  }

  const response = await api.get(
    RUTA_RESUMEN,
    {
      params: parametros,
    },
  );

  const data = obtenerDataRespuesta(response);

  if (data === undefined || data === null) {
    return {
      totalCasos: 0,
      totalMortalidad: 0,
      enfermedadesFrecuentes: [],
      severidadesFrecuentes: [],
    };
  }

  return data;
}

/*
============================================================
CATALOGOS
============================================================
*/

export async function obtenerCatalogoEnfermedades() {
  const response = await api.get(
    RUTA_CATALOGO_ENFERMEDADES,
  );

  return adaptarCatalogo(
    obtenerListaRespuesta(response),
  );
}

export async function obtenerCatalogoSeveridades() {
  const response = await api.get(
    RUTA_CATALOGO_SEVERIDADES,
  );

  return adaptarCatalogo(
    obtenerListaRespuesta(response),
  );
}

/*
============================================================
FINCAS
============================================================
*/

export async function obtenerOpcionesFincas() {
  let fincasBackend = [];

  try {
    const response = await api.get(RUTA_FINCAS);

    fincasBackend = obtenerListaRespuesta(response);
  } catch (error) {
    console.error(
      "Error al cargar fincas:",
      error.response?.data ||
        error.message,
    );
  }

  const fincas = agregarFincasRespaldo(fincasBackend);
  const opciones = [];

  for (let i = 0; i < fincas.length; i++) {
    const finca = fincas[i];
    const fincaId = obtenerIdFinca(finca);

    if (fincaId <= 0) {
      continue;
    }

    const nombre = obtenerPrimerValor(
      finca,
      [
        "nombreFinca",
        "nombre_finca",
        "nombre",
      ],
    );

    opciones.push({
      label: obtenerTextoSeguro(
        nombre,
        "Finca sin nombre",
      ),
      value: String(fincaId),
      id: fincaId,
      data: finca,
    });
  }

  return opciones;
}

/*
============================================================
ESTANQUES
============================================================
*/

export async function obtenerOpcionesEstanques() {
  let estanquesBackend = [];

  try {
    const response = await api.get(RUTA_ESTANQUES);

    estanquesBackend = obtenerListaRespuesta(response);
  } catch (error) {
    console.error(
      "Error al cargar estanques:",
      error.response?.data ||
        error.message,
    );
  }

  const estanques = agregarEstanquesRespaldo(
    estanquesBackend,
  );

  const opciones = [];

  for (let i = 0; i < estanques.length; i++) {
    const estanque = estanques[i];
    const estanqueId = obtenerIdEstanque(estanque);
    const fincaId = obtenerFincaIdEstanque(estanque);

    if (estanqueId <= 0 || fincaId <= 0) {
      continue;
    }

    const codigo = obtenerTextoSeguro(
      estanque.codigo,
      "Estanque sin codigo",
    );

    opciones.push({
      label: codigo,
      value: String(estanqueId),
      id: estanqueId,
      fincaId: fincaId,
      data: estanque,
    });
  }

  return opciones;
}

/*
============================================================
NOMBRES
============================================================
*/

export function obtenerNombreEnfermedad(valor) {
  const texto = obtenerTextoSeguro(
    valor,
    "Enfermedad registrada",
  );

  const codigo = texto.toLowerCase();

  if (codigo === "wssv") {
    return "WSSV - Mancha Blanca";
  }

  if (codigo === "ahpnd") {
    return "AHPND - Necrosis hepatopancreatica aguda";
  }

  if (codigo === "vibriosis") {
    return "Vibriosis";
  }

  if (codigo === "ihhnv") {
    return "IHHNV";
  }

  if (codigo === "nhp") {
    return "NHP - Hepatobacter penaei";
  }

  if (codigo === "otro") {
    return "Otro";
  }

  return texto;
}

export function obtenerNombreSeveridad(valor) {
  const texto = obtenerTextoSeguro(
    valor,
    "Sin severidad",
  );

  const codigo = texto.toLowerCase();

  if (codigo === "bajo" || codigo === "baja") {
    return "Baja";
  }

  if (codigo === "medio" || codigo === "media") {
    return "Media";
  }

  if (codigo === "alto" || codigo === "alta") {
    return "Alta";
  }

  if (codigo === "critica") {
    return "Critica";
  }

  return texto;
}

/*
============================================================
EXPORT DEFAULT
============================================================
*/

const enfermedadesService = {
  getAll: obtenerEnfermedades,
  getById: obtenerEnfermedadPorId,
  create: crearEnfermedad,
  update: actualizarEnfermedad,
  remove: eliminarEnfermedad,
  deleteById: eliminarEnfermedad,
  getResumenDashboard: obtenerResumenEnfermedades,
  getCatalogo: obtenerCatalogoEnfermedades,
  getCatalogoSeveridades: obtenerCatalogoSeveridades,
  getFincas: obtenerOpcionesFincas,
  getEstanques: obtenerOpcionesEstanques,
};

export default enfermedadesService;
