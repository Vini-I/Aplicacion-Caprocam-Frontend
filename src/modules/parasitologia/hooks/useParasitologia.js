/**
 * ============================================================
 * HOOK: useParasitologia
 * ============================================================
 *
 * Gestiona los registros reales del backend.
 */

import {
  useEffect,
  useState,
} from "react";

import parasitologiaService, {
  construirResumenParasitologia,
  obtenerMensajeError,
  PARASITOS_CATALOGO,
} from "../services/ParasitologiaService";

export default function useParasitologia() {
  const [
    registrosParasitologia,
    setRegistrosParasitologia,
  ] = useState([]);

  const [
    resumen,
    setResumen,
  ] = useState(
    construirResumenParasitologia([]),
  );

  const [
    catalogoParasitos,
    setCatalogoParasitos,
  ] = useState(
    PARASITOS_CATALOGO,
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function recargar() {
    setLoading(true);
    setError("");

    try {
      const respuestas =
        await Promise.all([
          parasitologiaService.getAll(),
          parasitologiaService
            .getResumenDashboard(),
        ]);

      setRegistrosParasitologia(
        respuestas[0],
      );

      setResumen(
        respuestas[1],
      );

      try {
        const catalogo =
          await parasitologiaService
            .getCatalogo();

        setCatalogoParasitos(
          catalogo,
        );
      } catch {
        setCatalogoParasitos(
          PARASITOS_CATALOGO,
        );
      }
    } catch (errorCarga) {
      setError(
        obtenerMensajeError(
          errorCarga,
          "No se pudieron cargar los registros de parasitologia.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  async function guardarRegistro(
    registro,
  ) {
    setLoading(true);
    setError("");

    try {
      const nuevoRegistro =
        await parasitologiaService.create(
          registro,
        );

      await recargar();

      return nuevoRegistro;
    } catch (errorGuardado) {
      setError(
        obtenerMensajeError(
          errorGuardado,
          "No se pudo guardar el registro de parasitologia.",
        ),
      );

      return null;
    } finally {
      setLoading(false);
    }
  }

  async function actualizarRegistro(
    id,
    registro,
  ) {
    setLoading(true);
    setError("");

    try {
      const actualizado =
        await parasitologiaService.update(
          id,
          registro,
        );

      await recargar();

      return actualizado;
    } catch (errorActualizacion) {
      setError(
        obtenerMensajeError(
          errorActualizacion,
          "No se pudo actualizar el registro de parasitologia.",
        ),
      );

      return null;
    } finally {
      setLoading(false);
    }
  }

  async function eliminarRegistro(id) {
    setLoading(true);
    setError("");

    try {
      const eliminado =
        await parasitologiaService
          .deleteById(id);

      await recargar();

      return eliminado;
    } catch (errorEliminacion) {
      setError(
        obtenerMensajeError(
          errorEliminacion,
          "No se pudo eliminar el registro de parasitologia.",
        ),
      );

      return null;
    } finally {
      setLoading(false);
    }
  }

  async function buscarRegistro(id) {
    setLoading(true);
    setError("");

    try {
      return await parasitologiaService
        .getById(id);
    } catch (errorBusqueda) {
      setError(
        obtenerMensajeError(
          errorBusqueda,
          "No se pudo obtener el registro de parasitologia.",
        ),
      );

      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(
    function () {
      recargar();
    },
    [],
  );

  return {
    registrosParasitologia,
    resumen,
    catalogoParasitos,
    loading,
    error,
    recargar,
    buscarRegistro,
    guardarRegistro,
    actualizarRegistro,
    eliminarRegistro,
  };
}