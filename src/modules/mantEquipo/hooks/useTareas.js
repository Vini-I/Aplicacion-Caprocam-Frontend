/**
 * HOOK: useTareas
 * Ruta: src/modules/mantEquipo/hooks/useTareas.js
 *
 * Hook personalizado para gestionar las tareas de mantenimiento.
 * Proporciona estado, carga, filtrado y operaciones CRUD.
 *
 * Ejemplo de uso:
 *   const { tareas, loading, error, crearTarea, eliminarTarea } = useTareas();
 */

import { useState, useEffect, useCallback } from "react";
import * as tareasService from "../services/tareasService";

export const useTareas = () => {
  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [tareas, setTareas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --------------------------------------------------------
  // CARGA DE DATOS
  // --------------------------------------------------------
  const cargarTareas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await tareasService.obtenerTareas();
      setTareas(datos);
    } catch (err) {
      setError(err.message || "Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial al montar el hook.
  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

  // --------------------------------------------------------
  // FILTRADO LOCAL (por nombre, descripción o categoría)
  // --------------------------------------------------------
  const tareasFiltradas = tareas.filter((t) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase().trim();
    return (
      t.nombre.toLowerCase().includes(q) ||
      t.descripcion.toLowerCase().includes(q) ||
      t.categoria.toLowerCase().includes(q)
    );
  });

  // --------------------------------------------------------
  // OPERACIONES CRUD
  // --------------------------------------------------------

  /**
   * Crea una nueva tarea.
   * @param {Object} datos - { nombre, descripcion, categoria, duracionEstimada }
   * @returns {Promise<Object>} Tarea creada.
   */
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

  /**
   * Actualiza una tarea existente.
   * @param {string} id - ID de la tarea.
   * @param {Object} datos - Campos a actualizar.
   * @returns {Promise<Object>} Tarea actualizada.
   */
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

  /**
   * Elimina una tarea por su ID.
   * @param {string} id - ID de la tarea.
   * @returns {Promise<boolean>}
   */
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

  // --------------------------------------------------------
  // RETORNO DEL HOOK
  // --------------------------------------------------------
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