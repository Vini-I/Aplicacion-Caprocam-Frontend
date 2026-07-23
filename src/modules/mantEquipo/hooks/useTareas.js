// src/modules/mantEquipo/hooks/useTareas.js

/**
 * ============================================================
 * HOOK: useTareas
 * ============================================================
 *
 * Hook personalizado para gestionar las tareas de mantenimiento.
 * Proporciona estado, carga, filtrado y operaciones CRUD.
 * También maneja los filtros de categoría y estado, y las opciones
 * para los selects del FilterButton.
 *
 * Retorna:
 * - tareas, tareasFiltradas, busqueda, setBusqueda, loading, error
 * - cargarTareas, crearTarea, actualizarTarea, eliminarTarea
 * - filtros, setFiltros, opcionesCategoria, opcionesEstado
 * - tareasFinales (ya filtradas por categoría y estado)
 * ============================================================
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import * as tareasService from "../services/tareasService";
import { OPCIONES_CATEGORIA, OPCIONES_ESTADO } from "../constants/tareasMensajes";

export const useTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialLoadDone = useRef(false);

  // ─── FILTROS ADICIONALES ──────────────────────────────────────
  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: "",
  });

  // ─── OPCIONES PARA FILTERBUTTON ──────────────────────────────
  const opcionesCategoria = useMemo(
    () => OPCIONES_CATEGORIA.map((c) => ({ label: c.label, value: c.value })),
    []
  );
  const opcionesEstado = useMemo(
    () => OPCIONES_ESTADO.map((e) => ({ label: e.label, value: e.value })),
    []
  );

  // ─── CARGA DE DATOS ────────────────────────────────────────────
  const cargarTareas = useCallback(async (force = false) => {
    if (!force && tareas.length > 0 && initialLoadDone.current) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const datos = await tareasService.obtenerTareas();
      setTareas(datos);
      initialLoadDone.current = true;
    } catch (err) {
      setError(err.message || "Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, [tareas.length]);

  // Carga inicial
  useEffect(() => {
    cargarTareas(true);
  }, []);

  // Recarga al recibir foco
  useFocusEffect(
    useCallback(() => {
      if (initialLoadDone.current) {
        cargarTareas(true);
      }
    }, [cargarTareas])
  );

  // ─── FILTRADO LOCAL ────────────────────────────────────────────
  // Filtro por búsqueda de texto
  const tareasFiltradas = useMemo(() => {
    return tareas.filter((t) => {
      if (!busqueda.trim()) return true;
      const q = busqueda.toLowerCase().trim();
      return (
        t.nombre.toLowerCase().includes(q) ||
        t.descripcion.toLowerCase().includes(q) ||
        t.categoria.toLowerCase().includes(q)
      );
    });
  }, [tareas, busqueda]);

  // Aplicar filtros adicionales (categoría y estado)
  const tareasFinales = useMemo(() => {
    return tareasFiltradas.filter((t) => {
      if (filtros.categories.length > 0 && !filtros.categories.includes(t.categoria))
        return false;
      if (filtros.suppliers.length > 0 && !filtros.suppliers.includes(t.estado))
        return false;
      return true;
    });
  }, [tareasFiltradas, filtros]);

  // ─── CRUD ──────────────────────────────────────────────────────
  const crearTarea = async (datos) => {
    setLoading(true);
    try {
      const nueva = await tareasService.crearTarea(datos);
      setTareas((prev) => [...prev, nueva]);
      return nueva;
    } catch (err) {
      setError(err.message || "Error al crear la tarea");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarTarea = async (id, datos) => {
    setLoading(true);
    try {
      const actualizada = await tareasService.actualizarTarea(id, datos);
      setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
      return actualizada;
    } catch (err) {
      setError(err.message || "Error al actualizar la tarea");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarTarea = async (id) => {
    setLoading(true);
    try {
      await tareasService.eliminarTarea(id);
      setTareas((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err) {
      setError(err.message || "Error al eliminar la tarea");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ─── RETORNO ──────────────────────────────────────────────────
  return {
    tareas,
    tareasFiltradas,
    tareasFinales,
    busqueda,
    setBusqueda,
    loading,
    error,
    cargarTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
    filtros,
    setFiltros,
    opcionesCategoria,
    opcionesEstado,
  };
};