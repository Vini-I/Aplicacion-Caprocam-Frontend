/**
 * ============================================================
 * SERVICIO TrazabilidadServices
 * ============================================================
 *
 * Descripción:
 * Consulta, filtrado y registro de movimientos de trazabilidad con la API (compatible con Web y Móvil mediante AsyncStorage y consulta unificada de siembras/pre-crías).
 *
 * @dependencies AsyncStorage, api, fincaService
 * @validations Normalización de estanques, cruce de nombres de fincas/estanques y autocompletado de PL/días.
 * @navigation N/A
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api/api";
import { fincaService } from "../../finca/services/finca.service";
import { isSameDate, toMysqlDate } from "../../../shared/utils/dateUtils";

function decodificarJwtPayload(token) {
  if (!token) return null;
  const partes = token.split(".");
  if (partes.length !== 3) return null;
  try {
    const payloadBase64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadBase64.padEnd(payloadBase64.length + ((4 - (payloadBase64.length % 4)) % 4), "=");
    const decoded = typeof globalThis !== "undefined" && typeof globalThis.atob === "function"
      ? globalThis.atob(padded)
      : Buffer.from(padded, "base64").toString("binary");
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

let cachedSesion = null;

function procesarSesionDesdePayloadYUsuario(payload, usuarioGuardado) {
  if (!payload && !usuarioGuardado) {
    return {
      esColaborador: false,
      tipo: "usuario",
      id: null,
      nombre: "Usuario",
      colaboradorId: null,
    };
  }

  const esColaborador = payload?.esColaborador === true || (Boolean(payload?.colaboradorId) && !payload?.usuario);

  if (esColaborador) {
    const colaboradorId = payload?.colaboradorId ?? payload?.id ?? null;
    const nombre = payload?.nombre ?? usuarioGuardado?.nombre ?? (colaboradorId ? `Colaborador ${colaboradorId}` : "Colaborador");
    return {
      esColaborador: true,
      tipo: "colaborador",
      id: colaboradorId,
      nombre,
      colaboradorId: colaboradorId ? Number(colaboradorId) : null,
    };
  }

  const usuarioId = payload?.id ?? usuarioGuardado?.id ?? null;
  const nombre = payload?.nombre ?? usuarioGuardado?.nombre ?? payload?.usuario ?? "Usuario";
  return {
    esColaborador: false,
    tipo: "usuario",
    id: usuarioId,
    nombre,
    colaboradorId: null,
  };
}

export async function obtenerSesionDesdeTokenLocal() {
  let token = null;
  let usuarioGuardado = null;
  try {
    if (typeof AsyncStorage !== "undefined" && AsyncStorage.getItem) {
      token = await AsyncStorage.getItem("caprocam_auth_token");
      const raw = await AsyncStorage.getItem("caprocam_usuario");
      if (raw) usuarioGuardado = JSON.parse(raw);
    }
  } catch (e) {
    // Ignorar
  }

  if (!token && typeof localStorage !== "undefined") {
    try {
      token = localStorage.getItem("caprocam_auth_token");
      const raw = localStorage.getItem("caprocam_usuario");
      if (!usuarioGuardado && raw) usuarioGuardado = JSON.parse(raw);
    } catch (e) {
      // Ignorar
    }
  }

  const payload = decodificarJwtPayload(token);
  const sesion = procesarSesionDesdePayloadYUsuario(payload, usuarioGuardado);
  cachedSesion = sesion;
  return sesion;
}

export function obtenerSesionDesdeTokenLocalSync() {
  if (cachedSesion) return cachedSesion;
  let token = null;
  let usuarioGuardado = null;
  if (typeof localStorage !== "undefined") {
    try {
      token = localStorage.getItem("caprocam_auth_token");
      const raw = localStorage.getItem("caprocam_usuario");
      if (raw) usuarioGuardado = JSON.parse(raw);
    } catch (e) { }
  }
  const payload = decodificarJwtPayload(token);
  return procesarSesionDesdePayloadYUsuario(payload, usuarioGuardado);
}

function obtenerValor(estanque, campos) {
  for (const campo of campos) {
    const valor = estanque?.[campo];
    if (valor !== undefined && valor !== null && valor !== "") {
      return valor;
    }
  }
  return undefined;
}

function normalizarEstanque(estanque) {
  const id = obtenerValor(estanque, ["id", "estanqueId"]);
  const fincaId = obtenerValor(estanque, ["idFinca", "fincaId", "finca_id"]);
  const codigo = obtenerValor(estanque, ["codigo", "codigoEstanque"]);
  const tipoEstanque = obtenerValor(estanque, ["tipoEstanque", "tipo_estanque", "tipo"]);
  const estado = obtenerValor(estanque, ["estado", "estadoEstanque"]);
  const usaPrecria = obtenerValor(estanque, ["precria", "usa_precria", "usaPrecria"]);

  return {
    ...estanque,
    id,
    fincaId,
    finca_id: fincaId,
    codigo,
    tipoEstanque,
    tipo_estanque: tipoEstanque,
    estado,
    precria: usaPrecria,
    usa_precria: usaPrecria,
  };
}

function mapearEstanquesAOptions(estanques) {
  return (estanques ?? [])
    .map(normalizarEstanque)
    .map((estanque) => ({
      label: `${estanque.codigo ?? "Estanque"} (${estanque.tipoEstanque ?? ""})`,
      value: estanque.id,
      raw: estanque,
    }));
}

function obtenerTipoEstanque(estanque) {
  const rawTipo = obtenerValor(estanque, ["tipoEstanque", "tipo_estanque", "tipo"]);
  if (rawTipo !== undefined && rawTipo !== null && rawTipo !== "") {
    return String(rawTipo).trim().toLowerCase();
  }

  const rawEstado = obtenerValor(estanque, ["estado", "estadoEstanque"]);
  if (rawEstado !== undefined && rawEstado !== null && rawEstado !== "") {
    return String(rawEstado).trim().toLowerCase();
  }

  return "";
}

export function esEstanquePreCria(estanque) {
  const tipo = obtenerTipoEstanque(estanque);
  if (tipo.includes("pre")) return true;
  if (tipo.includes("engorde")) return false;

  const raw = estanque?.precria ?? estanque?.usa_precria ?? estanque?.usaPrecria ?? "";
  const val = String(raw).trim().toLowerCase();
  if (val === "si" || val === "yes" || val === "true" || val === "1") return true;
  if (Number(raw) === 1) return true;
  return false;
}

export function esEstanqueEngorde(estanque) {
  const tipo = obtenerTipoEstanque(estanque);
  if (tipo.includes("engorde")) return true;
  if (tipo.includes("pre")) return false;

  const estado = String(obtenerValor(estanque, ["estado", "estadoEstanque"]) ?? "")
    .trim()
    .toLowerCase();
  return estado.includes("engorde");
}

function obtenerMensajeErrorBackend(error, mensajeGenerico) {
  const backendMsg =
    error?.response?.data?.message ||
    (Array.isArray(error?.response?.data?.error)
      ? error?.response?.data?.error.join(" ")
      : error?.response?.data?.error);

  if (backendMsg && typeof backendMsg === "string" && backendMsg.trim() !== "") {
    return backendMsg;
  }

  return mensajeGenerico;
}

export async function getRegistros() {
  try {
    const response = await api.get("/registrosTrazabilidad");
    return response.data.data;
  } catch (error) {
    const err = new Error(
      obtenerMensajeErrorBackend(error, "No se pudo obtener el listado de trazabilidad.")
    );
    err.response = error.response;
    throw err;
  }
}

export async function getRegistroPorId(id) {
  try {
    const response = await api.get(`/registrosTrazabilidad/${id}`);
    const registro = response.data.data;

    // El backend (trazabilidad.model.js) solo devuelve IDs crudos
    // (fincaId, estanqueOrigenId, estanqueDestinoId, colaboradorId).
    // Como no se toca el backend, se cruzan los IDs con nombres aquí.
    const [fincas, colaboradores, estanques] = await Promise.all([
      obtenerFincas().catch(() => []),
      obtenerColaboradores().catch(() => []),
      obtenerTodosLosEstanques().catch(() => []),
    ]);

    return enriquecerRegistro(registro, construirMapas({ fincas, colaboradores, estanques }));
  } catch (error) {
    const err = new Error(
      obtenerMensajeErrorBackend(error, "No se pudo obtener el detalle del registro de trazabilidad.")
    );
    err.response = error.response;
    throw err;
  }
}

export function filtrarRegistrosTrazabilidad(registros, texto, filtros) {
  const textoBusqueda = String(texto ?? "").trim().toLowerCase();

  return registros.filter((registro) => {
    const coincideBusqueda =
      textoBusqueda === "" ||
      [
        registro.fincaNombre,
        registro.colaboradorNombre,
        registro.estanqueOrigenLabel,
        registro.estanqueDestinoLabel,
      ].some((valor) =>
        String(valor ?? "").toLowerCase().includes(textoBusqueda),
      );

    const keyResponsable = registro.colaboradorId ?? (registro.creadoPorUsuarioId ? `user_${registro.creadoPorUsuarioId}` : registro.colaboradorNombre);

    const coincideFiltros =
      (filtros.fincas.length === 0 || filtros.fincas.includes(registro.fincaId)) &&
      ((filtros.estanques ?? []).length === 0 ||
        filtros.estanques.includes(registro.estanqueOrigenId) ||
        filtros.estanques.includes(registro.estanqueDestinoId)) &&
      (filtros.colaboradores.length === 0 ||
        filtros.colaboradores.includes(keyResponsable) ||
        filtros.colaboradores.includes(registro.colaboradorId) ||
        filtros.colaboradores.includes(registro.colaboradorNombre)) &&
      (filtros.fecha === "" ||
        registro.fecha === filtros.fecha ||
        isSameDate(registro.fecha, filtros.fecha) ||
        (toMysqlDate(registro.fecha) !== "" &&
          toMysqlDate(registro.fecha) === toMysqlDate(filtros.fecha)));

    return coincideBusqueda && coincideFiltros;
  });
}

export async function crearRegistro(datos) {
  try {
    const response = await api.post("/registrosTrazabilidad", datos);
    return response.data.data;
  } catch (error) {
    const err = new Error(
      obtenerMensajeErrorBackend(error, "No se pudo crear el registro de trazabilidad.")
    );
    err.response = error.response;
    throw err;
  }
}

export async function toggleActivoRegistro(id) {
  try {
    const response = await api.put(`/registrosTrazabilidad/${id}/activo`);
    return response.data.data;
  } catch (error) {
    const err = new Error(
      obtenerMensajeErrorBackend(error, "No se pudo actualizar el estado del registro.")
    );
    err.response = error.response;
    throw err;
  }
}

export async function obtenerFincas() {
  try {
    const fincas = await fincaService.getFincas();
    const lista = Array.isArray(fincas) ? fincas : [];
    return lista.map((finca) => ({
      label: finca.nombreFinca || finca.nombre || `Finca #${finca.id}`,
      value: finca.id,
    }));
  } catch (error) {
    return [];
  }
}

export async function obtenerEstanquesPorFinca(fincaId) {
  if (!fincaId) return [];
  try {
    const response = await api.get('/estanques');
    const estanques = (response.data.data ?? []).map(normalizarEstanque);
    return mapearEstanquesAOptions(
      estanques.filter((estanque) => String(estanque.fincaId ?? estanque.finca_id) === String(fincaId)),
    );
  } catch (error) {
    return [];
  }
}

export async function obtenerEstanquesPreCriaPorFinca(fincaId) {
  if (!fincaId) return [];
  try {
    const response = await api.get('/estanques');
    const estanques = (response.data.data ?? []).map(normalizarEstanque);
    return mapearEstanquesAOptions(
      estanques.filter((estanque) => {
        const fincaCoincide = String(estanque.fincaId ?? estanque.finca_id) === String(fincaId);
        const esPrecria = esEstanquePreCria(estanque);
        return fincaCoincide && esPrecria;
      }),
    );
  } catch (error) {
    return [];
  }
}

export async function obtenerEstanquesEngordePorFinca(fincaId) {
  if (!fincaId) return [];
  try {
    const response = await api.get('/estanques');
    const estanques = (response.data.data ?? []).map(normalizarEstanque);
    return mapearEstanquesAOptions(
      estanques.filter((estanque) => {
        const fincaCoincide = String(estanque.fincaId ?? estanque.finca_id) === String(fincaId);
        const esEngorde = esEstanqueEngorde(estanque);
        return fincaCoincide && esEngorde;
      }),
    );
  } catch (error) {
    return [];
  }
}

export async function obtenerTodosLosEstanques() {
  // El backend no filtra por finca (idFinca se ignora en
  // estanques.routes.js), así que se trae todo y se cruza
  // por ID en el cliente. Usado para enriquecer los registros
  // de trazabilidad (listado y detalle).
  try {
    const response = await api.get('/estanques');
    return (response.data.data ?? []).map((estanque) => ({
      label: `${estanque.codigo} (${estanque.tipoEstanque})`,
      value: estanque.id,
    }));
  } catch (error) {
    return [];
  }
}

// Trae la siembra o pre-cría activa del estanque de origen para precargar PL y
// días de cultivo en el formulario de Trazabilidad (compatible para Web y Móvil).
export async function obtenerSiembraActivaPorEstanque(estanqueId) {
  if (!estanqueId) return null;

  // 1. Intentar endpoint directo de siembra activa
  try {
    const response = await api.get("/siembras/activa", {
      params: { estanqueId },
    });
    if (response.data?.data) {
      return response.data.data;
    }
  } catch (error) {
    // Continuar a fallbacks si no hay respuesta directa
  }

  // 2. Intentar buscar en el listado general de siembras
  try {
    const responseSiembras = await api.get("/siembras");
    const siembrasList = Array.isArray(responseSiembras.data?.data) ? responseSiembras.data.data : [];
    const siembraCoincidente = siembrasList.find(
      (s) => String(s.estanqueId ?? s.estanque_id) === String(estanqueId)
    );

    if (siembraCoincidente) {
      const hoy = new Date();
      const rawFecha = siembraCoincidente.fechaSiembra ?? siembraCoincidente.fecha_siembra;
      const fechaSiembra = rawFecha ? new Date(rawFecha) : null;
      const diasCalculados = (fechaSiembra && !isNaN(fechaSiembra.getTime()))
        ? Math.max(0, Math.floor((hoy - fechaSiembra) / (1000 * 60 * 60 * 24)))
        : (siembraCoincidente.dias ?? siembraCoincidente.duracionCiclo ?? siembraCoincidente.duracion_ciclo ?? "");

      const plCalculado = siembraCoincidente.plSiembra ?? siembraCoincidente.pl_siembra ?? siembraCoincidente.cantidadSembrada ?? siembraCoincidente.cantidad_sembrada ?? "";

      return {
        pl_siembra: plCalculado,
        dias: diasCalculados,
      };
    }
  } catch (err) { }

  // 3. Intentar buscar en el listado de pre-crías (ej. estanques tipo precria como EST-02)
  try {
    const responsePrecria = await api.get("/precrias");
    const precriasList = Array.isArray(responsePrecria.data?.data) ? responsePrecria.data.data : [];
    const precriaCoincidente = precriasList.find(
      (p) => String(p.estanqueId ?? p.estanque_id) === String(estanqueId)
    );

    if (precriaCoincidente) {
      const hoy = new Date();
      const rawFecha = precriaCoincidente.fechaInicio ?? precriaCoincidente.fecha_inicio;
      const fechaInicio = rawFecha ? new Date(rawFecha) : null;
      const diasCalculados = (fechaInicio && !isNaN(fechaInicio.getTime()))
        ? Math.max(0, Math.floor((hoy - fechaInicio) / (1000 * 60 * 60 * 24)))
        : (precriaCoincidente.duracionDias ?? precriaCoincidente.duracion_dias ?? "");

      const plCalculado = precriaCoincidente.plFinal ?? precriaCoincidente.pl_final ?? precriaCoincidente.plInicial ?? precriaCoincidente.pl_inicial ?? "";

      return {
        pl_siembra: plCalculado,
        dias: diasCalculados,
      };
    }
  } catch (err) { }

  return null;
}

export async function obtenerColaboradores() {
  try {
    const colaboradores = await colaboradorService.getColaboradores();
    return (colaboradores ?? []).map((colaborador) => ({
      label: [colaborador.nombre, colaborador.apellidos].filter(Boolean).join(" "),
      value: colaborador.id,
    }));
  } catch (error) {
    return [];
  }
}

export async function obtenerSesionFormulario() {
  const sesion = await obtenerSesionDesdeTokenLocal();
  const esUsuario = sesion.tipo === "usuario";

  return {
    tipo: sesion.tipo,
    labelCampo: esUsuario ? "Usuario responsable" : "Colaborador responsable",
    nombre: sesion.nombre,
    label: esUsuario ? `Usuario: ${sesion.nombre}` : `Colaborador: ${sesion.nombre}`,
    colaboradorId: sesion.colaboradorId,
    usuarioId: esUsuario ? sesion.id : null,
  };
}

/**
 * ------------------------------------------------------------
 * Enriquecimiento de registros (cruce de IDs a nombres)
 * ------------------------------------------------------------
 * El backend (trazabilidad.model.js -> mapearFila) solo devuelve
 * IDs crudos (fincaId, estanqueOrigenId, estanqueDestinoId, colaboradorId). Como no se toca
 * el backend, se cruzan los IDs con nombres aquí.
 */

export function construirMapas({ fincas = [], colaboradores = [], estanques = [] } = {}) {
  const fincasMap = new Map(fincas.map((f) => [f.value, f.label]));
  const colaboradoresMap = new Map(colaboradores.map((c) => [c.value, c.label]));
  const estanquesMap = new Map(estanques.map((e) => [e.value, e.label]));

  return {
    fincasMap,
    colaboradoresMap,
    estanquesMap,
  };
}

export function enriquecerRegistro(registro = {}, mapas = {}, sesionOpt = null) {
  const { fincasMap = new Map(), colaboradoresMap = new Map(), estanquesMap = new Map() } = mapas;

  let responsableNombre = "";
  let tipoResponsable = "Colaborador";
  const sesionActual = sesionOpt || obtenerSesionDesdeTokenLocalSync();

  if (registro.colaboradorId && colaboradoresMap.has(registro.colaboradorId)) {
    responsableNombre = colaboradoresMap.get(registro.colaboradorId);
    tipoResponsable = "Colaborador";
  } else if (registro.colaboradorNombre) {
    responsableNombre = registro.colaboradorNombre;
    tipoResponsable = "Colaborador";
  } else if (registro.usuarioNombre || registro.creadoPorUsuarioNombre || registro.creadoPorUsuario?.nombre || registro.usuario?.nombre) {
    responsableNombre = registro.usuarioNombre || registro.creadoPorUsuarioNombre || registro.creadoPorUsuario?.nombre || registro.usuario?.nombre;
    tipoResponsable = "Usuario";
  } else if (registro.creadoPorUsuarioId || registro.usuarioId || registro.usuario_id) {
    const usuarioIdReg = registro.creadoPorUsuarioId || registro.usuarioId || registro.usuario_id;
    if (sesionActual && sesionActual.tipo === "usuario" && sesionActual.nombre) {
      responsableNombre = sesionActual.nombre;
    } else {
      responsableNombre = `Usuario #${usuarioIdReg}`;
    }
    tipoResponsable = "Usuario";
  } else if (sesionActual && sesionActual.tipo === "usuario" && !registro.colaboradorId) {
    responsableNombre = sesionActual.nombre || "Usuario";
    tipoResponsable = "Usuario";
  } else if (registro.creadoPorColaboradorId) {
    responsableNombre = `Colaborador #${registro.creadoPorColaboradorId}`;
    tipoResponsable = "Colaborador";
  } else {
    responsableNombre = "Sin asignar";
    tipoResponsable = "Responsable";
  }

  return {
    ...registro,
    fincaNombre: fincasMap.get(registro.fincaId) || registro.fincaNombre || (registro.fincaId ? `Finca #${registro.fincaId}` : "Finca"),
    colaboradorNombre: responsableNombre,
    tipoResponsable,
    responsableTexto: `${tipoResponsable}: ${responsableNombre}`,
    estanqueOrigenLabel:
      estanquesMap.get(registro.estanqueOrigenId) || registro.estanqueOrigenLabel || (registro.estanqueOrigenId ? `Estanque #${registro.estanqueOrigenId}` : "Estanque Origen"),
    estanqueDestinoLabel:
      estanquesMap.get(registro.estanqueDestinoId) || registro.estanqueDestinoLabel || (registro.estanqueDestinoId ? `Estanque #${registro.estanqueDestinoId}` : "Estanque Destino"),
  };
}

export function enriquecerRegistros(registros = [], mapas) {
  if (!Array.isArray(registros)) return [];
  return registros.map((r) => enriquecerRegistro(r, mapas));
}