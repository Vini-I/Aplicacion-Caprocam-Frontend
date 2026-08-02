/**
 * ============================================================
 * HOOK: useMantPrincipalScreen
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * FUNCIONALIDAD:
 * - Carga el catálogo de tareas y la lista de equipos al iniciar.
 * - Aplica filtrado combinado: búsqueda de texto + estado de equipo
 *   + estado de ticket sobre el listado de tickets del hook useMantEquipo.
 * - Gestiona las alertas temporales que llegan vía props.
 *
 * IMPORTANTE:
 * - Los filtros de búsqueda/estado son locales a esta pantalla.
 * - El catálogo de tareas se usa para búsqueda cruzada (nombre/descripción
 *   de la tarea asociada al ticket).
 *
 * @dependencies - useMantEquipo (tickets, busqueda, cargando, setBusqueda)
 *               - obtenerTareas de tareasService
 *               - equiposService.getEquipos
 * @validations  - Filtrado en memoria insensible a mayúsculas/minúsculas
 * @navigation   - Ninguna (los callbacks de navegación son props del screen)
 */

import { useState, useMemo, useEffect } from 'react';
import { useMantEquipo } from './useMantEquipo';
import { obtenerTareas } from '../services/tareasService';
import { equiposService } from '../services/equiposService';

export function useMantPrincipalScreen({ alertaTipo, alertaMensaje, refreshTimestamp }) {
  const {
    tickets,
    busqueda,
    cargando,
    setBusqueda,
  } = useMantEquipo();

  // ── Filtros de estado ────────────────────────────────────────
  const [filtros, setFiltros] = useState({
    estadosEquipo: [],
    estadosTicket: [],
    fecha: "",
  });

  // ── Alertas temporales (pasadas por props desde el layout) ──
  const [alerta, setAlerta] = useState(null);

  // ── Catálogos para búsqueda cruzada ──────────────────────────
  const [tareasCatalog, setTareasCatalog] = useState([]);
  const [equiposList, setEquiposList] = useState([]);

  useEffect(() => {
    obtenerTareas().then(data => setTareasCatalog(data || [])).catch(() => {});
    equiposService.getEquipos().then(data => setEquiposList(data || [])).catch(() => {});
  }, []);

  // ── Alerta por props ────────────────────────────────────────
  useEffect(() => {
    if (alertaTipo && alertaMensaje) {
      setAlerta({
        tipo: alertaTipo,
        mensaje: alertaMensaje,
      });
      const timer = setTimeout(() => {
        setAlerta(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alertaTipo, alertaMensaje, refreshTimestamp]);

  // ── Filtrado combinado ──────────────────────────────────────
  const ticketsFiltrados = useMemo(() => {
    let result = tickets;

    // 1. Filtrar por búsqueda de texto
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      result = result.filter((t) => {
        const coincideCampos = ["id", "descripcion", "titulo", "creadoPor", "estado"].some(
          (k) => String(t[k] ?? "").toLowerCase().includes(q)
        );
        const coincideTareas = Array.isArray(t.tareas) && t.tareas.some((tar) => {
          const fullTask = tareasCatalog.find((d) => d.id === tar.value) || tar;
          return (fullTask.nombre || fullTask.label || "").toLowerCase().includes(q) ||
            (fullTask.descripcion || "").toLowerCase().includes(q);
        });
        return coincideCampos || coincideTareas;
      });
    }

    // 2. Filtrar por estado de equipo seleccionado
    if (filtros.estadosEquipo.length > 0) {
      result = result.filter((t) => {
        const equipo = equiposList.find((e) => String(e.id) === String(t.equipoId));
        const estEq = equipo?.estado || "activo";
        return filtros.estadosEquipo.includes(estEq);
      });
    }

    // 3. Filtrar por estado de ticket seleccionado
    if (filtros.estadosTicket.length > 0) {
      result = result.filter((t) => filtros.estadosTicket.includes(t.estado));
    }

    return result;
  }, [tickets, busqueda, filtros, tareasCatalog, equiposList]);

  return {
    tickets,
    ticketsFiltrados,
    busqueda,
    setBusqueda,
    cargando,
    filtros,
    setFiltros,
    alerta,
  };
}
