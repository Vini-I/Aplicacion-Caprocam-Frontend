/**
 * ============================================================
 * HOOK PERSONALIZADO: useColaboradores
 * ============================================================
 *
 * Hook que encapsula la lógica de obtención y manipulación
 * de colaboradores. Utiliza el servicio colaboradoresService
 * y mantiene estado local (lista, loading, error).
 *
 * Parámetros:
 * - initialFilters: objeto con filtros iniciales (fincaId, rol, activo)
 *
 * Retorna:
 * - colaboradores: array de colaboradores
 * - loading: boolean
 * - error: string | null
 * - filters: objeto con filtros actuales
 * - setFilters: función para actualizar filtros
 * - fetchColaboradores: función para recargar datos
 * - crearColaborador, actualizarColaborador, eliminarColaborador: funciones asíncronas
 *
 * Ejemplo:
 * const { colaboradores, loading, crearColaborador } = useColaboradores({ rol: 'external_worker' });
 */

// ============================================================
// IMPORTS
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { colaboradoresService } from "../services/colaboradoresService";

// ============================================================
// HOOK
// ============================================================
export function useColaboradores(initialFilters = {}) {
  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // --------------------------------------------------------
  // FUNCIÓN PRINCIPAL PARA OBTENER DATOS
  // --------------------------------------------------------
  const fetchColaboradores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await colaboradoresService.getColaboradores(filters);
      setColaboradores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Ejecuta la carga cada vez que cambian los filtros
  useEffect(() => {
    fetchColaboradores();
  }, [fetchColaboradores]);

  // --------------------------------------------------------
  // CRUD
  // --------------------------------------------------------
  const crearColaborador = async (data) => {
    setLoading(true);
    try {
      const nuevo = await colaboradoresService.createColaborador(data);
      setColaboradores((prev) => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarColaborador = async (id, data) => {
    setLoading(true);
    try {
      const actualizado = await colaboradoresService.updateColaborador(id, data);
      setColaboradores((prev) =>
        prev.map((c) => (c.id === id ? actualizado : c))
      );
      return actualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarColaborador = async (id) => {
    setLoading(true);
    try {
      await colaboradoresService.deleteColaborador(id);
      setColaboradores((prev) => prev.filter((c) => c.id !== id));
      return true;
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
    colaboradores,
    loading,
    error,
    filters,
    setFilters,
    fetchColaboradores,
    crearColaborador,
    actualizarColaborador,
    eliminarColaborador,
  };
}