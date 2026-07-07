/**
 * HOOK: useMantEquipo
 * Ruta: src/modules/mantEquipo/hooks/useMantEquipo.js
 *
 * Carga los tickets de mantenimiento y expone las operaciones CRUD
 * sobre ellos. El filtrado por texto se delega al backend; localmente
 * solo se mantiene el estado de la cadena de búsqueda.
 *
 * TODO backend: reemplazar obtenerTickets() por llamada real al API.
 */

import { useState, useEffect } from "react";
import * as MantService from "../services/mantEquipoService.js";

export function useMantEquipo() {
  const [tickets,  setTickets]  = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  /** Carga inicial de tickets al montar el componente. */
  useEffect(() => {
    const { obtenerTickets } = MantService;
    if (typeof obtenerTickets !== "function") { setCargando(false); return; }

    obtenerTickets()
      .then((data) => setTickets(Array.isArray(data) ? data : []))
      .catch(() => setTickets([]))
      .finally(() => setCargando(false));
  }, []);

  /**
   * Avanza el estado de un ticket de "fuera de servicio" a "en mantenimiento".
   * Solo opera si el ticket está en el estado correcto de partida.
   * @param {string} ticketId - ID del ticket a actualizar.
   */
  function toggleEstado(ticketId) {
    const { ESTADOS } = MantService;
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId || t.estado !== ESTADOS?.FUERA_DE_SERVICIO) return t;
        return { ...t, estado: ESTADOS.EN_MANTENIMIENTO };
      })
    );
  }

  /**
   * Inserta un ticket nuevo al inicio de la lista.
   * @param {object} nuevoTicket - Ticket recién creado.
   */
  function agregarTicket(nuevoTicket) {
    setTickets((prev) => [nuevoTicket, ...prev]);
  }

  /**
   * Elimina un ticket de la lista local por su ID.
   * @param {string} ticketId - ID del ticket a eliminar.
   */
  function eliminarTicket(ticketId) {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  }

  /**
   * Aplica cambios parciales a un ticket existente.
   * @param {object} cambios - Objeto con al menos { id } y los campos a actualizar.
   */
  function actualizarTicket(cambios) {
    setTickets((prev) =>
      prev.map((t) => (t.id === cambios.id ? { ...t, ...cambios } : t))
    );
  }

  return {
    tickets,
    /** Alias de tickets; el filtrado real lo aplicará el backend. */
    ticketsFiltrados: tickets,
    busqueda,
    cargando,
    setBusqueda,
    toggleEstado,
    agregarTicket,
    eliminarTicket,
    actualizarTicket,
  };
}
