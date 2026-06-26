/**
 * ============================================================
 * HOOK: useEnfermedades
 * ============================================================
 *
 * Hook principal del modulo Enfermedades.
 *
 * Funcionalidad:
 * - Carga registros guardados.
 * - Guarda nuevos registros de enfermedades.
 * - Elimina registros.
 * - Construye resumen para dashboard.
 */

import { useEffect, useState } from "react";

import enfermedadesService from "../services/EnfermedadesService";
import { construirResumenEnfermedades } from "../services/EnfermedadesService";

export default function useEnfermedades() {
  const [enfermedades, setEnfermedades] = useState([]);
  const [resumen, setResumen] = useState(construirResumenEnfermedades([]));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function recargar() {
    setLoading(true);
    setError("");

    try {
      const datos = await enfermedadesService.getAll();
      const nuevoResumen = construirResumenEnfermedades(datos);

      setEnfermedades(datos);
      setResumen(nuevoResumen);
    } catch {
      setError("No se pudieron cargar las enfermedades.");
    }

    setLoading(false);
  }

  async function guardarEnfermedad(registro) {
    setLoading(true);
    setError("");

    try {
      const nuevoRegistro = await enfermedadesService.create(registro);
      await recargar();

      setLoading(false);

      return nuevoRegistro;
    } catch {
      setError("No se pudo guardar la enfermedad.");
      setLoading(false);

      return null;
    }
  }

  async function eliminarEnfermedad(id) {
    setLoading(true);
    setError("");

    try {
      await enfermedadesService.deleteById(id);
      await recargar();
    } catch {
      setError("No se pudo eliminar la enfermedad.");
    }

    setLoading(false);
  }

  async function limpiarEnfermedades() {
    setLoading(true);
    setError("");

    try {
      await enfermedadesService.clearAll();
      await recargar();
    } catch {
      setError("No se pudieron limpiar las enfermedades.");
    }

    setLoading(false);
  }

  useEffect(function () {
    recargar();
  }, []);

  return {
    enfermedades,
    resumen,
    loading,
    error,
    recargar,
    guardarEnfermedad,
    eliminarEnfermedad,
    limpiarEnfermedades,
  };
}
