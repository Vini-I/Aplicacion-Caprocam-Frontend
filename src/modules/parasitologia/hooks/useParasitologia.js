/**
 * ============================================================
 * HOOK DE PARASITOLOGIA
 * ============================================================
 *
 * Centraliza el estado y las operaciones del backend
 * correspondientes al modulo de parasitologia.
 */

import { useEffect, useState } from "react";

import { useError } from "../../../shared/context/ErrorContext";
import parasitologiaService from "../services/ParasitologiaService";

const RESUMEN_INICIAL = {
  totalRegistros: 0,
  totalMuestreados: 0,
  totalInfectados: 0,
  totalCamaronesMuestreados: 0,
  totalCamaronesInfectados: 0,
  porcentajePromedio: 0,
  promedioInfeccion: 0,
  gradoPromedio: 0,
  parasitosFrecuentes: [],
  gradosFrecuentes: [],
};

export default function useParasitologia() {
  const { mostrarError } = useError();

  const [registrosParasitologia, setRegistrosParasitologia] = useState([]);
  const [resumen, setResumen] = useState(RESUMEN_INICIAL);
  const [catalogoParasitos, setCatalogoParasitos] = useState([]);
  const [loading, setLoading] = useState(false);

  async function cargarDatos() {
    try {
      setLoading(true);

      const [registros, resumenBackend, catalogo] = await Promise.all([
        parasitologiaService.getAll(),
        parasitologiaService.getResumenDashboard(),
        parasitologiaService.getCatalogo(),
      ]);

      setRegistrosParasitologia(Array.isArray(registros) ? registros : []);
      setResumen(resumenBackend && typeof resumenBackend === "object" ? resumenBackend : RESUMEN_INICIAL);
      setCatalogoParasitos(Array.isArray(catalogo) ? catalogo : []);
    } catch (error) {
      console.error("Error al cargar parasitologias", error);
      mostrarError(error);
    } finally {
      setLoading(false);
    }
  }

  async function buscarRegistro(id) {
    try {
      setLoading(true);
      return await parasitologiaService.getById(id);
    } catch (error) {
      console.error("Error al buscar parasitologia", error);
      mostrarError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function guardarRegistro(registro) {
    try {
      setLoading(true);

      const nuevoRegistro = await parasitologiaService.create(registro);
      await cargarDatos();

      return nuevoRegistro;
    } catch (error) {
      console.error("Error al guardar parasitologia", error);
      mostrarError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function actualizarRegistro(id, registro) {
    try {
      setLoading(true);

      const registroActualizado = await parasitologiaService.update(id, registro);
      await cargarDatos();

      return registroActualizado;
    } catch (error) {
      console.error("Error al actualizar parasitologia", error);
      mostrarError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function eliminarRegistro(id) {
    try {
      setLoading(true);

      const registroEliminado = await parasitologiaService.deleteById(id);
      await cargarDatos();

      return registroEliminado;
    } catch (error) {
      console.error("Error al eliminar parasitologia", error);
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
    registrosParasitologia,
    resumen,
    catalogoParasitos,
    loading,
    recargar: cargarDatos,
    buscarRegistro,
    guardarRegistro,
    actualizarRegistro,
    eliminarRegistro,
  };
}