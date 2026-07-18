/**
 * ============================================================
 * SERVICIOS - TRAZABILIDAD
 * ============================================================
 *
 * Descripción:
 * Implementa funciones de consulta y filtrado de registros de
 * trazabilidad. Actualmente usa datos locales en memoria como
 * placeholder hasta integrar con un backend.
 *
 * Funcionalidad principal:
 * - `obtenerRegistrosTrazabilidad`, `obtenerRegistroTrazabilidadPorId`,
 *   `filtrarRegistrosTrazabilidad`, `agregarRegistroTrazabilidad`,
 *   `obtenerFincas`, `obtenerEstanquesPorFinca`, `obtenerSiembraPorEstanque`, `obtenerColaboradores`.
 *
 * Restricciones del proyecto:
 * - Reemplazar la implementación por llamadas a la API cuando el
 *   backend esté disponible, asegurando manejo de errores y tests.
 */

import { registrosTrazabilidad } from "../screens/TrazabilidadData";
import { obtenerSiembras } from "../../siembra/services/SiembraService";

let registros = [...registrosTrazabilidad];

export function obtenerRegistrosTrazabilidad() {
  return registros;
}

export function obtenerRegistroTrazabilidadPorId(id) {
  return registros.find((registro) => registro.id === id);
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
      (filtros.colaboradores.length === 0 ||
        filtros.colaboradores.includes(registro.colaboradorId)) &&
      (filtros.fecha === "" || registro.fecha === filtros.fecha);

    return coincideBusqueda && coincideFiltros;
  });
}

export function agregarRegistroTrazabilidad(registro) {
  registros = [registro, ...registros];

  return registro;
}

export function obtenerFincas() {
  return [
    { label: "Finca Camarón de Occidente", value: "laReina" },
    { label: "Finca Camarón del Sur", value: "laEsperanza" },
    { label: "Finca Camarón del Norte", value: "laVilla" },
  ];
}

export function obtenerEstanquesPorFinca(fincaId) {
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
  if (!estanqueId) return null;

  const siembras = obtenerSiembras();

  function normalize(text) {
    return String(text ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  }

  const objetivo = normalize(estanqueId);

  const siembra = siembras.find((s) => normalize(s.estanque) === objetivo);

  return siembra ?? null;
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


