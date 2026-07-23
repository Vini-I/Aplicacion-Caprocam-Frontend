/**
 * ============================================================
 * HOOK: useTareas
 * ============================================================
 *
 * Hook personalizado para gestionar las tareas de mantenimiento.
 * Proporciona estado, carga, filtrado y operaciones CRUD.
 *
 * Retorna:
 * - tareas: array completo de tareas
 * - tareasFiltradas: array filtrado según búsqueda
 * - busqueda: string para filtrar
 * - setBusqueda: función para actualizar la búsqueda
 * - loading: boolean
 * - error: string | null
 * - cargarTareas: función para recargar datos
 * - crearTarea, actualizarTarea, eliminarTarea: funciones asíncronas
 * ============================================================
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import * as tareasService from "../services/tareasService";

export const useTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialLoadDone = useRef(false);

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

  // Filtrado local por búsqueda
  const tareasFiltradas = tareas.filter((t) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase().trim();
    return (
      t.nombre.toLowerCase().includes(q) ||
      t.descripcion.toLowerCase().includes(q) ||
      t.categoria.toLowerCase().includes(q)
    );
  });

  // CRUD
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

  return {
    tareas,
    tareasFiltradas,
    busqueda,
    setBusqueda,
    loading,
    error,
    cargarTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
  };
};