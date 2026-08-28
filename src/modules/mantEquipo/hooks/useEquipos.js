/**
 * HOOK: useEquipos
 * Encapsula la obtención, filtrado y manipulación CRUD de la lista de equipos conectados al backend.
 *
 * @dependencies - equiposService.js (services/equiposService.js)
 * @validations  - Mantiene estado local de carga, errores de red y filtros de búsqueda.
 * @navigation   - Ninguna
 */

// ============================================================
// IMPORTS
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { equiposService } from "../services/equiposService";
import { useError } from "../../../shared/context/ErrorContext";

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
  const { mostrarError } = useError();

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
      mostrarError(err);
    } finally {
      setLoading(false);
    }
  }, [filters, mostrarError]);

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
      mostrarError(err);
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
      mostrarError(err);
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

  const [togglingId, setTogglingId] = useState(null);

  const toggleEquipo = async (id) => {
    if (togglingId) return; // Bloquear spam de clicks mientras se procesa uno
    setTogglingId(id);
    try {
      const equipoActual = equipos.find(e => e.id === id);
      if (!equipoActual) {
        throw new Error("Equipo no encontrado");
      }

      // Llamar al endpoint toggle
      await equiposService.toggleEquipoEstado(id);

      // Recargar datos frescos del backend (garantiza horasActuales correctas)
      const data = await equiposService.getEquipos(filters);
      setEquipos(data);

      await fetchProximosMantenimiento();
      await fetchEstadisticas();
    } catch (err) {
      setError(err.message);
      mostrarError(err);
      throw err;
    } finally {
      setTogglingId(null);
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
    togglingId,
  };
}