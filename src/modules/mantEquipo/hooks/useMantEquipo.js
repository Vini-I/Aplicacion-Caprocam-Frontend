/**
 * ============================================================
 * HOOK: useMantEquipo
 * ============================================================
 * 
 * Responsabilidad: Maneja el estado de la lista de tickets:
 * obtención inicial, sincronización al enfocar la pantalla y
 * el texto de búsqueda reactivo.
 * 
 * Datos:
 * - tickets: Lista completa de tickets.
 * 
 * Navegación:
 * - Ninguna.
 * 
 * Dependencias:
 * - mantEquipoService.js
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

  return {
    tickets,
    busqueda, setBusqueda,
    cargando,
  };
}