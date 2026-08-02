/**
 * HOOK: useMantEquipo
 * Maneja el estado global de la lista de tickets, obtención inicial
 * desde el backend y operaciones CRUD conectadas a la API REST.
 *
 * @dependencies - mantEquipoService.js
 *               - useNavigation de expo-router
 * @validations  - Expone errores de red mediante el estado errorRed.
 * @navigation   - N/A (hook de estado).
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigation } from "expo-router";
import * as MantService from "../services/mantEquipoService.js";

export function useMantEquipo() {
  const [tickets, setTickets] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [errorRed, setErrorRed] = useState(null);
  const navigation = useNavigation();

  const cargarTickets = useCallback(() => {
    setCargando(true);
    setErrorRed(null);
    MantService.obtenerTickets()
      .then((data) => {
        const lista = Array.isArray(data) ? data : [];
        // Ordenar de mayor a menor (más reciente arriba) por ID numérico
        lista.sort((a, b) => Number(b.id) - Number(a.id));
        setTickets(lista);
      })
      .catch((err) => {
        console.error('useMantEquipo.cargarTickets:', err?.message || err);
        setErrorRed('No se pudo cargar la lista de tickets. Verifica la conexión.');
        setTickets([]);
      })
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargarTickets();
    const unsubscribe = navigation.addListener("focus", cargarTickets);
    return unsubscribe;
  }, [navigation, cargarTickets]);

  async function agregarTicket(t) {
    const creado = await MantService.agregarTicket(t);
    if (creado) {
      setTickets(prev => [creado, ...prev]);
    } else {
      cargarTickets();
    }
    return creado;
  }

  async function eliminarTicket(id) {
    setTickets(prev => prev.filter(t => t.id !== id));
    await MantService.eliminarTicket(id);
  }

  async function actualizarTicket(upd) {
    const actualizado = await MantService.actualizarTicket(upd);
    if (actualizado) {
      setTickets(prev => prev.map(t => t.id === upd.id ? actualizado : t));
    }
    return actualizado;
  }

  function actualizarEstadoEquipo(equipoId, nuevoEstado) {
    MantService.actualizarEstadoEquipo(equipoId, nuevoEstado);
  }

  return {
    tickets,
    busqueda, setBusqueda,
    cargando,
    errorRed,
    cargarTickets,
    agregarTicket, eliminarTicket, actualizarTicket, actualizarEstadoEquipo,
  };
}
