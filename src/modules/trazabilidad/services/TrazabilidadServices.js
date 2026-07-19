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
 *   `obtenerSiembraPorEstanque`, `obtenerColaboradores`.
 *
 * Restricciones del proyecto:
 * - No modificar los módulos de finca/colaboradores/siembra, solo
 *   se consumen sus servicios.
 */

import api from "../../../api/api";
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
    return response.data.data;
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
  // TODO: confirmar con API los nombres reales de los campos de finca
  return fincas.map((finca) => ({ label: finca.nombre, value: finca.id }));
}

export function obtenerEstanquesPorFinca(fincaId) {
  // Bloqueado: pendiente que finca exponga GET /fincas/:fincaId/estanques
  const estanquesPorFinca = {
    laReina: [
      { label: "Estanque P-01 (Pre-cría)", value: "A01" },
      { label: "Estanque P-02 (Pre-cría)", value: "A02" },
      { label: "Estanque E-08 (Engorde)", value: "B01" },
      { label: "Estanque E-09 (Engorde)", value: "B02" },
    ],
    laEsperanza: [
      { label: "Estanque P-03 (Pre-cría)", value: "P-03" },
      { label: "Estanque E-02 (Engorde)", value: "E-02" },
      { label: "Estanque E-03 (Engorde)", value: "E-03" },
    ],
    laVilla: [
      { label: "Estanque P-04 (Pre-cría)", value: "P-04" },
      { label: "Estanque E-05 (Engorde)", value: "E-05" },
    ],
  };

  return estanquesPorFinca[fincaId] || [];
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
  // TODO: confirmar con API los nombres reales de los campos de colaborador
  return colaboradores.map((colaborador) => ({ label: colaborador.nombre, value: colaborador.id }));
}
export function obtenerColaboradorSesion() {
  // TODO: reemplazar por el colaborador autenticado real (token/contexto
  // de sesión) cuando este módulo se conecte al backend de autenticación.
  // Por ahora se simula el usuario que inició sesión.
  // Este se utiliza en crearRegistro para asignar el colaborador que realiza la acción.
  return { label: "Elena Rostova", value: "elenaRostova" };
}


