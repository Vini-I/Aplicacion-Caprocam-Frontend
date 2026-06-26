/**
 * ============================================================
 * HOOK: useParasitologia
 * ============================================================
 *
 * Hook principal del modulo Parasitologia.
 *
 * Funcionalidad:
 * - Carga registros guardados.
 * - Guarda nuevos registros.
 * - Elimina registros.
 * - Construye resumen para dashboard.
 */

import { useEffect, useState } from "react";

import parasitologiaService from "../services/ParasitologiaService";
import { construirResumenParasitologia } from "../services/ParasitologiaService";

export default function useParasitologia() {
  const [registrosParasitologia, setRegistrosParasitologia] = useState([]);
  const [resumen, setResumen] = useState(construirResumenParasitologia([]));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function recargar() {
    setLoading(true);
    setError("");

    try {
      const datos = await parasitologiaService.getAll();
      const nuevoResumen = construirResumenParasitologia(datos);

      setRegistrosParasitologia(datos);
      setResumen(nuevoResumen);
    } catch {
      setError("No se pudieron cargar los registros de parasitologia.");
    }

    setLoading(false);
  }

  async function guardarRegistro(registro) {
    setLoading(true);
    setError("");

    try {
      const nuevoRegistro = await parasitologiaService.create(registro);

      await recargar();

      setLoading(false);

      return nuevoRegistro;
    } catch {
      setError("No se pudo guardar el registro de parasitologia.");
      setLoading(false);

      return null;
    }
  }

  async function eliminarRegistro(id) {
    setLoading(true);
    setError("");

    try {
      await parasitologiaService.deleteById(id);
      await recargar();
    } catch {
      setError("No se pudo eliminar el registro de parasitologia.");
    }

    setLoading(false);
  }

  async function limpiarRegistros() {
    setLoading(true);
    setError("");

    try {
      await parasitologiaService.clearAll();
      await recargar();
    } catch {
      setError("No se pudieron limpiar los registros de parasitologia.");
    }

    setLoading(false);
  }

  useEffect(function () {
    recargar();
  }, []);

  return {
    registrosParasitologia,
    resumen,
    loading,
    error,
    recargar,
    guardarRegistro,
    eliminarRegistro,
    limpiarRegistros,
  };
}