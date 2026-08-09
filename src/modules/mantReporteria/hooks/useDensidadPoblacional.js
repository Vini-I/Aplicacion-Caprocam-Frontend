/**
 * ============================================================
 * HOOK DE DENSIDAD POBLACIONAL
 * ============================================================
 *
 * Autocontenido: carga, eliminación y alert.
 * Enriquece: nombreFinca, codigoEstanque, nombreColaborador, nombreCreadoPor
 */
import { useState, useEffect } from "react";
import densidadPoblacionalService from "../../densidadPoblacional/services/DensidadPoblacional.service.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";
import { cargarYEnriquecerRegistros } from "../utils/enriquecerRegistros.js";
import { useError } from "../../../shared/context/ErrorContext.js";

export default function useDensidadPoblacional(fincaId, estanqueId, onAlertChange) {
  const [densidades, setDensidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const { mostrarError } = useError();

  async function cargarDensidades() {
    try {
      setLoading(true);

      const data = await obtenerDetalleReporte({
        tipoRegistro: "densidad_poblacional",
        fincaId,
        estanqueId,
      });

      const enriquecidos = await cargarYEnriquecerRegistros(data);
      setDensidades(enriquecidos);
    } catch (error) {
      mostrarError(error);
      setDensidades([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fincaId && estanqueId) {
      cargarDensidades();
    }
  }, [fincaId, estanqueId]);

  async function eliminarDensidad(id) {
    await densidadPoblacionalService.deleteById(id);
    await cargarDensidades();
    setAlert("deleted");
  }

  const {
    modalVisible,
    itemSeleccionado: densidadSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useModalEliminar(eliminarDensidad);

  useEffect(() => {
    onAlertChange?.(alert);
  }, [alert]);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return {
    densidades,
    loading,
    alert,
    modalVisible,
    densidadSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
