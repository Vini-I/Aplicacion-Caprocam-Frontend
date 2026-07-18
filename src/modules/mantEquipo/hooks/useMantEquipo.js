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
import { useNavigation } from "expo-router";
import * as MantService from "../services/mantEquipoService.js";

export function useMantEquipo() {
  const [tickets,  setTickets]  = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation();

  const cargarTickets = () => {
    setCargando(true);
    MantService.obtenerTickets()
      .then((data) => setTickets(Array.isArray(data) ? data : []))
      .catch(() => setTickets([]))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarTickets();

    const unsubscribe = navigation.addListener("focus", () => {
      // Sincronizar instantáneamente con la base mutable en memoria
      setTickets([...MantService.TICKETS_MOCK]);
    });

    return unsubscribe;
  }, [navigation]);

  function agregarTicket(t) {
    MantService.agregarTicket(t);
    setTickets([...MantService.TICKETS_MOCK]);
  }

  function eliminarTicket(id) {
    MantService.eliminarTicket(id);
    setTickets([...MantService.TICKETS_MOCK]);
  }

  function actualizarTicket(upd) {
    MantService.actualizarTicket(upd);
    setTickets([...MantService.TICKETS_MOCK]);
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
