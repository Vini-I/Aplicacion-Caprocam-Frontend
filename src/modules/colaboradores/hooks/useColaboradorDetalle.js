/**
 * ============================================================
 * HOOK: useColaboradorDetalle
 * ============================================================
 *
 * Encapsula la lógica de la pantalla de detalle de un colaborador:
 * carga de datos, filtrado de trabajadores a cargo, estados.
 *
 * Parámetros:
 * - colaboradorId: string - ID del colaborador a mostrar
 *
 * Retorna:
 * - colaborador, trabajadores, trabajadoresFiltrados, externalOwner,
 *   estadisticas, loading, error, searchText, setSearchText
 */

import { useState, useEffect } from "react";
import { colaboradoresService } from "../services/colaboradoresService";

export function useColaboradorDetalle(colaboradorId) {
  const [colaborador, setColaborador] = useState(null);
  const [trabajadores, setTrabajadores] = useState([]);
  const [trabajadoresFiltrados, setTrabajadoresFiltrados] = useState([]);
  const [externalOwner, setExternalOwner] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [colab, stats] = await Promise.all([
          colaboradoresService.getColaboradorById(colaboradorId),
          colaboradoresService.getEstadisticasColaborador(colaboradorId),
        ]);
        setColaborador(colab);
        setEstadisticas(stats);

        if (colab.rol === "external_owner") {
          const trabajadoresData = await colaboradoresService.getTrabajadoresByOwner(colaboradorId);
          setTrabajadores(trabajadoresData);
          setTrabajadoresFiltrados(trabajadoresData);
        }

        if (colab.rol === "external_worker" && colab.externalOwnerId) {
          const owner = await colaboradoresService.getColaboradorById(colab.externalOwnerId);
          setExternalOwner(owner);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (colaboradorId) {
      loadData();
    }
  }, [colaboradorId]);

  // Filtrar trabajadores por búsqueda
  useEffect(() => {
    if (!searchText) {
      setTrabajadoresFiltrados(trabajadores);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtrados = trabajadores.filter(
        (colab) =>
          colab.nombre.toLowerCase().includes(searchLower) ||
          colab.telefono.includes(searchText) ||
          colab.email.toLowerCase().includes(searchLower) ||
          colab.cedula.includes(searchText)
      );
      setTrabajadoresFiltrados(filtrados);
    }
  }, [searchText, trabajadores]);

  return {
    colaborador,
    trabajadores,
    trabajadoresFiltrados,
    externalOwner,
    estadisticas,
    loading,
    error,
    searchText,
    setSearchText,
  };
}