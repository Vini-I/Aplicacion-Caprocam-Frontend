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
import { obtenerSiembras } from "../../siembra/services/SiembraService";

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
    return (response.data.data ?? [])
      .filter((estanque) => estanque.idFinca === fincaId)
      .map((estanque) => ({
        label: `${estanque.codigo} (${estanque.tipoEstanque})`,
        value: estanque.id,
      }));
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

export function obtenerSiembraPorEstanque(estanqueId) {
  // Bloqueado: pendiente confirmar con Siembra si expone
  // GET /estanques/:estanqueId/siembra-activa
  if (!estanqueId) return null;

  const siembras = obtenerSiembras();

  function normalize(text) {
    return String(text ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  }

  const objetivo = normalize(estanqueId);

  const siembra = siembras.find((s) => normalize(s.estanque) === objetivo);

  return siembra ?? null;
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

export function enriquecerRegistro(registro = {}, mapas = {}) {
  const { fincasMap = new Map(), colaboradoresMap = new Map(), estanquesMap = new Map() } = mapas;

  return {
    ...registro,
    fincaNombre: fincasMap.get(registro.fincaId) ?? registro.fincaNombre ?? "",
    colaboradorNombre:
      colaboradoresMap.get(registro.colaboradorId) ?? registro.colaboradorNombre ?? "",
    estanqueOrigenLabel:
      estanquesMap.get(registro.estanqueOrigenId) ?? registro.estanqueOrigenLabel ?? "",
    estanqueDestinoLabel:
      estanquesMap.get(registro.estanqueDestinoId) ?? registro.estanqueDestinoLabel ?? "",
  };
}

export function enriquecerRegistros(registros = [], mapas) {
  if (!Array.isArray(registros)) return [];
  return registros.map((r) => enriquecerRegistro(r, mapas));
}