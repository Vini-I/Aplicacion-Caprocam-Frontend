/**
 * ============================================================
 * HOOK DE ENFERMEDADES
 * ============================================================
 *
 * Centraliza el estado y las operaciones del backend
 * correspondientes al modulo de enfermedades.
 */

import { useEffect, useState } from "react";

import { useError } from "../../../shared/context/ErrorContext";
import enfermedadesService from "../services/EnfermedadesService";

const RESUMEN_INICIAL = {
  totalCasos: 0,
  totalMortalidad: 0,
  enfermedadesFrecuentes: [],
  severidadesFrecuentes: [],
};

export default function useEnfermedades() {
  const { mostrarError } = useError();

  const [enfermedades, setEnfermedades] = useState([]);
  const [resumen, setResumen] = useState(RESUMEN_INICIAL);
  const [catalogoEnfermedades, setCatalogoEnfermedades] = useState([]);
  const [catalogoSeveridades, setCatalogoSeveridades] = useState([]);
  const [loading, setLoading] = useState(false);

  async function cargarDatos() {
    try {
      setLoading(true);

      const [registros, resumenBackend, enfermedadesCatalogo, severidadesCatalogo] = await Promise.all([
        enfermedadesService.getAll(),
        enfermedadesService.getResumenDashboard(),
        enfermedadesService.getCatalogo(),
        enfermedadesService.getCatalogoSeveridades(),
      ]);

      setEnfermedades(Array.isArray(registros) ? registros : []);
      setResumen(resumenBackend && typeof resumenBackend === "object" ? resumenBackend : RESUMEN_INICIAL);
      setCatalogoEnfermedades(Array.isArray(enfermedadesCatalogo) ? enfermedadesCatalogo : []);
      setCatalogoSeveridades(Array.isArray(severidadesCatalogo) ? severidadesCatalogo : []);
    } catch (error) {
      console.error("Error al cargar enfermedades", error);
      mostrarError(error);
    } finally {
      setLoading(false);
    }
  }

  async function buscarEnfermedad(id) {
    try {
      setLoading(true);
      return await enfermedadesService.getById(id);
    } catch (error) {
      console.error("Error al buscar la enfermedad", error);
      mostrarError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function guardarEnfermedad(registro) {
    try {
      setLoading(true);

      const nuevaEnfermedad = await enfermedadesService.create(registro);
      await cargarDatos();

      return nuevaEnfermedad;
    } catch (error) {
      console.error("Error al guardar la enfermedad", error);
      mostrarError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function actualizarEnfermedad(id, registro) {
    try {
      setLoading(true);

      const enfermedadActualizada = await enfermedadesService.update(id, registro);
      await cargarDatos();

      return enfermedadActualizada;
    } catch (error) {
      console.error("Error al actualizar la enfermedad", error);
      mostrarError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function eliminarEnfermedad(id) {
    try {
      setLoading(true);

      const enfermedadEliminada = await enfermedadesService.deleteById(id);
      await cargarDatos();

      return enfermedadEliminada;
    } catch (error) {
      console.error("Error al eliminar la enfermedad", error);
      mostrarError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    enfermedades,
    resumen,
    catalogoEnfermedades,
    catalogoSeveridades,
    loading,
    recargar: cargarDatos,
    buscarEnfermedad,
    guardarEnfermedad,
    actualizarEnfermedad,
    eliminarEnfermedad,
  };
}