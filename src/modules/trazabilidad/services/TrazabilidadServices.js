/**
 * ============================================================
 * SERVICIOS - TRAZABILIDAD
 * ============================================================
 *
 * Descripción:
 * Consulta y registro de movimientos de trazabilidad contra la API.
 * Estanques por finca y siembra activa siguen locales porque
 * dependen de otros módulos (finca y siembra) que todavía no
 * exponen esos endpoints.
 *
 * Funcionalidad principal:
 * - `getRegistros`, `getRegistroPorId`, `crearRegistro`, `toggleActivoRegistro`,
 *   `filtrarRegistrosTrazabilidad`, `obtenerFincas`, `obtenerEstanquesPorFinca`,
 *   `obtenerTodosLosEstanques`, `obtenerSiembraPorEstanque`, `obtenerColaboradores`.
 *
 * Restricciones del proyecto:
 * - No modificar los módulos de finca/colaboradores/siembra, solo
 *   se consumen sus servicios.
 */

import api, { obtenerColaboradorIdDesdeToken } from "../../../api/api";
import { fincaService } from "../../finca/services/finca.service";
import { colaboradorService } from "../../colaboradores/services/colaborador.service";

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

function esEstanquePreCria(estanque) {
  const raw = estanque?.precria ?? estanque?.usa_precria ?? estanque?.usaPrecria ?? "";
  const val = String(raw).trim().toLowerCase();
  if (val === "si" || val === "yes" || val === "true" || val === "1") return true;
  // also accept numeric 1
  if (Number(raw) === 1) return true;
  return false;
}

export async function getRegistros() {
  try {
    const response = await api.get("/registrosTrazabilidad");
    return response.data.data;
  } catch (error) {
    throw error;
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
    throw error;
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

    const coincideFiltros =
      (filtros.fincas.length === 0 || filtros.fincas.includes(registro.fincaId)) &&
      ((filtros.estanques ?? []).length === 0 ||
        filtros.estanques.includes(registro.estanqueOrigenId) ||
        filtros.estanques.includes(registro.estanqueDestinoId)) &&
      (filtros.colaboradores.length === 0 ||
        filtros.colaboradores.includes(registro.colaboradorId)) &&
      (filtros.fecha === "" || registro.fecha === filtros.fecha);

    return coincideBusqueda && coincideFiltros;
  });
}

export async function crearRegistro(datos) {
  try {
    const response = await api.post("/registrosTrazabilidad", datos);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function toggleActivoRegistro(id) {
  try {
    const response = await api.put(`/registrosTrazabilidad/${id}/activo`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function obtenerFincas() {
  const fincas = await fincaService.getFincas();
  return fincas.map((finca) => ({ label: finca.nombreFinca, value: finca.id }));
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
        const esEngorde = String(estanque.estado ?? "").toLowerCase() === "engorde";
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

// Trae la siembra activa del estanque de origen para precargar PL y
// días de cultivo en el formulario de Trazabilidad. Usa el endpoint
// real de Siembra (GET /siembras/activa?estanqueId=), NO el mock de
// SiembraService.js -- ese mock sigue vivo solo para el módulo de
// Siembra, que aún no se conecta a la API (fuera de alcance aquí, no
// se toca ese módulo).
// Devuelve null si el estanque no tiene siembra activa (404 esperado,
// no es un error real) o si no se pudo consultar.
export async function obtenerSiembraActivaPorEstanque(estanqueId) {
  if (!estanqueId) return null;
  try {
    const response = await api.get("/siembras/activa", {
      params: { estanqueId },
    });
    return response.data.data ?? null;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    return null;
  }
}

export async function obtenerColaboradores() {
  const colaboradores = await colaboradorService.getColaboradores();
  return colaboradores.map((colaborador) => ({
    label: [colaborador.nombre, colaborador.apellidos].filter(Boolean).join(" "),
    value: colaborador.id,
  }));
}

export function obtenerColaboradorSesion() {
  return { label: "Cargando...", value: 1 };
}

export async function obtenerColaboradorSesionActual() {
  // El id ya no está fijo: se decodifica del token JWT actual
  // (ver obtenerColaboradorIdDesdeToken en src/api/api.js).
  const colaboradorId = await obtenerColaboradorIdDesdeToken();
  try {
    const colaborador = await colaboradorService.getColaboradorById(colaboradorId);
    const nombreCompleto = [colaborador?.nombre, colaborador?.apellidos]
      .filter(Boolean)
      .join(" ");
    return { label: nombreCompleto || `Colaborador ${colaboradorId}`, value: colaboradorId };
  } catch (error) {
    return { label: `Colaborador ${colaboradorId}`, value: colaboradorId };
  }
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

export function obtenerColaboradores() {
  // Datos de ejemplo; en un escenario real, estos datos deberían provenir de una API o base de datos.
  // con el listado de colaboradores se llena un array y este se 
  // retorna para el uso del filtrado por colaborador en la pantalla de trazabilidad.

  return [
    { label: "Mario Juárez", value: "marioJuarez" },
    { label: "Elena Rostova", value: "elenaRostova" },
    { label: "Carlos Méndez", value: "carlosMendez" },
  ];
}
  export function obtenerColaboradorSesion() {
    // TODO: reemplazar por el colaborador autenticado real (token/contexto
    // de sesión) cuando este módulo se conecte al backend de autenticación.
    // Por ahora se simula el usuario que inició sesión.
    // Este se utiliza en agregarRegistroTrazabilidad para asignar el colaborador que realiza la acción.
    return { label: "Elena Rostova", value: "elenaRostova" };
  }


