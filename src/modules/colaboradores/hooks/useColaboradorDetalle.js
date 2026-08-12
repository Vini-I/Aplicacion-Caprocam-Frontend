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
 *   fincaNombre, loading, error, searchText, setSearchText
 * ============================================================
 */

import { useState, useEffect } from "react";
import { colaboradoresService } from "../services/colaboradoresService";
import { getFincas } from "../services/fincaService";
import { useError } from "../../../shared/context/ErrorContext";

export function useColaboradorDetalle(colaboradorId) {
  const [colaborador, setColaborador] = useState(null);
  const [trabajadores, setTrabajadores] = useState([]);
  const [trabajadoresFiltrados, setTrabajadoresFiltrados] = useState([]);
  const [externalOwner, setExternalOwner] = useState(null);
  const [fincaNombre, setFincaNombre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const { mostrarError } = useError();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [colab, fincas] = await Promise.all([
          colaboradoresService.getColaboradorById(colaboradorId),
          getFincas(),
        ]);
        setColaborador(colab);

        // Resolver el nombre de la finca a partir del fincaId del colaborador.
        // Si no tiene finca asignada o no se encuentra en el catálogo,
        // se deja null (la pantalla mostrará "—").
        if (colab.fincaId) {
          const finca = fincas.find((f) => Number(f.id) === Number(colab.fincaId));
          setFincaNombre(finca?.nombreFinca || `Finca #${colab.fincaId}`);
        } else {
          setFincaNombre(null);
        }

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
        mostrarError(err);
      } finally {
        setLoading(false);
      }
    };
    if (colaboradorId) {
      loadData();
    }
  }, [colaboradorId, mostrarError]);

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
    fincaNombre,
    loading,
    error,
    searchText,
    setSearchText,
  };
}