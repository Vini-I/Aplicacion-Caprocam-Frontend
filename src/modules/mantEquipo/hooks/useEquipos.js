/**
 * ============================================================
 * HOOK PERSONALIZADO: useEquipos
 * ============================================================
 *
 * Hook que encapsula la lógica de obtención y manipulación
 * de equipos. Utiliza el servicio equiposService (ya conectado
 * al backend real) y mantiene estado local (lista, loading, error).
 *
 * Parámetros:
 * - initialFilters: objeto con filtros iniciales
 *
 * Retorna:
 * - equipos: array de equipos
 * - loading: boolean
 * - error: string | null
 * - filters: objeto con filtros actuales
 * - setFilters: función para actualizar filtros
 * - fetchEquipos: función para recargar datos
 * - crearEquipo, actualizarEquipo, eliminarEquipo, toggleEquipo: funciones asíncronas
 * - equiposProximosMantenimiento: array de equipos que necesitan mantenimiento
 * - estadisticas: objeto con estadísticas generales
 *
 * Ejemplo:
 * const { equipos, loading, crearEquipo } = useEquipos({ tipo: 'aireacion' });
 */

// ============================================================
// IMPORTS
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { equiposService } from "../services/equiposService";

// ============================================================
// HOOK
// ============================================================
export function useEquipos(initialFilters = {}) {
  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [equipos, setEquipos] = useState([]);
  const [equiposProximosMantenimiento, setEquiposProximosMantenimiento] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activos: 0,
    mantenimiento: 0,
    encendidos: 0,
    proximosMantenimiento: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // --------------------------------------------------------
  // FUNCIONES PARA OBTENER DATOS
  // --------------------------------------------------------
  const fetchEquipos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await equiposService.getEquipos(filters);
      setEquipos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchProximosMantenimiento = useCallback(async () => {
    try {
      const data = await equiposService.getEquiposProximosMantenimiento(100);
      setEquiposProximosMantenimiento(data);
    } catch (err) {
      // No mostrar error para no interferir con la lista principal
      console.warn("Error al obtener equipos próximos a mantenimiento:", err);
    }
  }, []);

  const fetchEstadisticas = useCallback(async () => {
    try {
      const data = await equiposService.getEstadisticasEquipos();
      setEstadisticas(data);
    } catch (err) {
      console.warn("Error al obtener estadísticas:", err);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchEquipos();
    fetchProximosMantenimiento();
    fetchEstadisticas();
  }, [fetchEquipos, fetchProximosMantenimiento, fetchEstadisticas]);

  // --------------------------------------------------------
  // CRUD
  // --------------------------------------------------------
  const crearEquipo = async (data) => {
    setLoading(true);
    try {
      const nuevo = await equiposService.createEquipo(data);
      setEquipos(prev => [...prev, nuevo]);
      await fetchProximosMantenimiento();
      await fetchEstadisticas();
      return nuevo;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarEquipo = async (id, data) => {
    setLoading(true);
    try {
      const actualizado = await equiposService.updateEquipo(id, data);
      setEquipos(prev => prev.map(e => (e.id === id ? actualizado : e)));
      await fetchProximosMantenimiento();
      await fetchEstadisticas();
      return actualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarEquipo = async (id) => {
    setLoading(true);
    try {
      await equiposService.deleteEquipo(id);
      setEquipos(prev => prev.filter(e => e.id !== id));
      await fetchProximosMantenimiento();
      await fetchEstadisticas();
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleEquipo = async (id) => {
    setLoading(true);
    try {
      // El backend exige el body completo en el PUT, así que
      // se envía el equipo actual junto con el nuevo estado.
      const equipoActual = equipos.find(e => e.id === id);
      if (!equipoActual) {
        throw new Error("Equipo no encontrado");
      }

      const actualizado = await equiposService.toggleEquipoEstado(id, equipoActual);
      setEquipos(prev => prev.map(e => (e.id === id ? actualizado : e)));
      await fetchProximosMantenimiento();
      await fetchEstadisticas();
      return actualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------
  // RETORNO DEL HOOK
  // --------------------------------------------------------
  return {
    equipos,
    equiposProximosMantenimiento,
    estadisticas,
    loading,
    error,
    filters,
    setFilters,
    fetchEquipos,
    crearEquipo,
    actualizarEquipo,
    eliminarEquipo,
    toggleEquipo,
  };
}