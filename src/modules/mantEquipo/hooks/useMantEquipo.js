/**
 * ============================================================
 * HOOK: useMantEquipo
 * ============================================================
 * 
 * Responsabilidad: Maneja el estado global de la lista de tickets,
 * obtención inicial, filtrado general y operaciones de CRUD
 * en memoria (demo).
 * 
 * Datos:
 * - tickets: Lista completa de tickets.
 * 
 * Validaciones:
 * - Filtra tickets en base al criterio seleccionado de forma segura.
 * 
 * Navegación:
 * - Ninguna.
 * 
 * Dependencias:
 * - mantEquipoService.js
 * - mantEquipoUtils.js
 */

import { useState, useEffect } from "react";
import * as MantService from "../services/mantEquipoService.js";

export function useMantEquipo() {
  const [tickets,  setTickets]  = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    MantService.obtenerTickets()
      .then((data) => setTickets(Array.isArray(data) ? data : []))
      .catch(() => setTickets([]))
      .finally(() => setCargando(false));
  }, []);



  function agregarTicket(t)         { setTickets((prev) => [t, ...prev]); }
  function eliminarTicket(id)       { setTickets((prev) => prev.filter((t) => t.id !== id)); }
  function actualizarTicket(upd)    {
    setTickets((prev) => prev.map((t) => t.id === upd.id ? { ...t, ...upd } : t));
  }

  // Cambia el estadoEquipo en el mock de equipos (demo sin backend)
  function actualizarEstadoEquipo(equipoId, nuevoEstado) {
    MantService.actualizarEstadoEquipo(equipoId, nuevoEstado);
  }

  return {
    tickets,
    busqueda, setBusqueda,
    cargando,
    agregarTicket, eliminarTicket, actualizarTicket, actualizarEstadoEquipo,
  };
}
