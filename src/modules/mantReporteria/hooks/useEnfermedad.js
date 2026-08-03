/**
 * ============================================================
 * HOOK DE ENFERMEDADES
 * ============================================================
 *
 * Autocontenido: carga, eliminación y alert.
 * Enriquece: nombreFinca, codigoEstanque, nombreColaborador, nombreCreadoPor
 */
import { useState, useEffect } from "react";
import enfermedadesService from "../../enfermedades/services/EnfermedadesService.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";
import { cargarYEnriquecerRegistros } from "../utils/enriquecerRegistros.js";
import { useError } from "../../../shared/context/ErrorContext.js";

export default function useEnfermedad(fincaId, estanqueId, onAlertChange) {
  const [enfermedades, setEnfermedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const { mostrarError } = useError();

  async function cargarEnfermedades() {
    try {
      setLoading(true);

      const data = await obtenerDetalleReporte({
        tipoRegistro: "enfermedades",
        fincaId,
        estanqueId,
      });

      const enriquecidos = await cargarYEnriquecerRegistros(data);
      setEnfermedades(enriquecidos);
    } catch (error) {
      mostrarError(error);
      setEnfermedades([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fincaId && estanqueId) {
      cargarEnfermedades();
    }
  }, [fincaId, estanqueId]);

  async function eliminarEnfermedad(id) {
    await enfermedadesService.deleteById(id);
    await cargarEnfermedades();
    setAlert("deleted");
  }

  const {
    modalVisible,
    itemSeleccionado: enfermedadSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useModalEliminar(eliminarEnfermedad);

  useEffect(() => {
    onAlertChange?.(alert);
  }, [alert]);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return {
    enfermedades,
    loading,
    alert,
    modalVisible,
    enfermedadSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
