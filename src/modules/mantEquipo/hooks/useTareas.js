/**
 * HOOK: useTareas
 * Gestiona el estado, recarga asíncrona, filtrado por texto/categoría/estado y operaciones CRUD de tareas.
 *
 * @dependencies - tareasService.js (services/tareasService.js), tareasMensajes.js (constants/tareasMensajes.js)
 * @validations  - Filtra tareas por coincidencia de texto, categoría y estado operativo.
 * @navigation   - Ninguna
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import { useError } from "../../../shared/context/ErrorContext";
import * as tareasService from "../services/tareasService";
import { OPCIONES_CATEGORIA } from "../constants/tareasMensajes";

export const useTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const initialLoadDone = useRef(false);
  const alertTimeoutRef = useRef(null);

  // ─── FILTROS ADICIONALES ──────────────────────────────────────
  const [filtros, setFiltros] = useState({
    categories: [],
  });

  // ─── OPCIONES PARA FILTERBUTTON ──────────────────────────────
  const opcionesCategoria = useMemo(
    () => OPCIONES_CATEGORIA.map((c) => ({ label: c.label, value: c.value })),
    []
  );

  const { mostrarError } = useError();

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
    } catch (err) {
      mostrarError(err);
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

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const activeFiltersForButton = useMemo(
    () => ({
      categories: filtros.categories || [],
      suppliers: [],
      units: [],
      lowStock: false,
      expiryDate: "",
    }),
    [filtros]
  );

  const handleApplyFilter = (pending) => {
    setFiltros({
      categories: pending.categories || [],
    });
  };

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
    alert,
    showAlert,
    activeFiltersForButton,
    handleApplyFilter,
    cargarTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
    filtros,
    setFiltros,
    opcionesCategoria,
  };
};