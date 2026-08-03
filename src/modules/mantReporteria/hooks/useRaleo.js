/**
 * ============================================================
 * HOOK DE RALEO
 * ============================================================
 *
 * Autocontenido: carga, eliminación y alert.
 * Enriquece: nombreFinca, codigoEstanque, nombreColaborador, nombreCreadoPor
 */
import { useState, useEffect } from "react";
import raleoService from "../../raleo/services/Raleo.service.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";
import { cargarYEnriquecerRegistros } from "../utils/enriquecerRegistros.js";
import { useError } from "../../../shared/context/ErrorContext.js";

export default function useRaleo(fincaId, estanqueId, onAlertChange) {
  const [raleos, setRaleos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const { mostrarError } = useError();

  async function cargarRaleos() {
    try {
      setLoading(true);

      const data = await obtenerDetalleReporte({
        tipoRegistro: "raleo",
        fincaId,
        estanqueId,
      });

      const enriquecidos = await cargarYEnriquecerRegistros(data);
      setRaleos(enriquecidos);
    } catch (error) {
      mostrarError(error);
      setRaleos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fincaId && estanqueId) {
      cargarRaleos();
    }
  }, [fincaId, estanqueId]);

  async function eliminarRaleo(id) {
    await raleoService.deleteById(id);
    await cargarRaleos();
    setAlert("deleted");
  }

  const {
    modalVisible,
    itemSeleccionado: raleoSeleccionado,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useModalEliminar(eliminarRaleo);

  useEffect(() => {
    onAlertChange?.(alert);
  }, [alert]);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return {
    raleos,
    loading,
    alert,
    modalVisible,
    raleoSeleccionado,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
