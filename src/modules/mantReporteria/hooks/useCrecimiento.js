/**
 * ============================================================
 * HOOK DE CRECIMIENTO
 * ============================================================
 *
 * Autocontenido: carga, eliminación y alert.
 * Enriquece: nombreFinca, codigoEstanque, nombreColaborador, nombreCreadoPor
 */
import { useState, useEffect } from "react";
import crecimientoService from "../../mantCrecimiento/services/mantCrecimiento.service.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";
import { cargarYEnriquecerRegistros } from "../utils/enriquecerRegistros.js";
import { useError } from "../../../shared/context/ErrorContext.js";

export default function useCrecimiento(fincaId, estanqueId, onAlertChange) {
  const [crecimientos, setCrecimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const { mostrarError } = useError();

  async function cargarCrecimientos() {
    try {
      setLoading(true);

      const data = await obtenerDetalleReporte({
        tipoRegistro: "crecimiento",
        fincaId,
        estanqueId,
      });

      const enriquecidos = await cargarYEnriquecerRegistros(data);
      setCrecimientos(enriquecidos);
    } catch (error) {
      mostrarError(error);
      setCrecimientos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fincaId && estanqueId) {
      cargarCrecimientos();
    }
  }, [fincaId, estanqueId]);

  async function eliminarCrecimiento(id) {
    await crecimientoService.deleteById(id);
    await cargarCrecimientos();
    setAlert("deleted");
  }

  const {
    modalVisible,
    itemSeleccionado: crecimientoSeleccionado,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useModalEliminar(eliminarCrecimiento);

  useEffect(() => {
    onAlertChange?.(alert);
  }, [alert]);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return {
    crecimientos,
    loading,
    alert,
    modalVisible,
    crecimientoSeleccionado,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
