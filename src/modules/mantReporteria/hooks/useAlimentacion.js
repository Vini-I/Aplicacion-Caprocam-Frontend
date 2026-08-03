/**
 * ============================================================
 * HOOK DE ALIMENTACIÓN
 * ============================================================
 *
 * Autocontenido: carga, eliminación y alert.
 * Enriquece: nombreFinca, codigoEstanque, nombreColaborador, nombreCreadoPor
 */
import { useState, useEffect } from "react";
import alimentacionService from "../../alimentacion/services/Alimentacion.service.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";
import { cargarYEnriquecerRegistros } from "../utils/enriquecerRegistros.js";
import { useError } from "../../../shared/context/ErrorContext.js";

export default function useAlimentacion(fincaId, estanqueId, onAlertChange) {
  const [alimentaciones, setAlimentaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const { mostrarError } = useError();

  async function cargarAlimentaciones() {
    try {
      setLoading(true);

      const data = await obtenerDetalleReporte({
        tipoRegistro: "alimentacion",
        fincaId,
        estanqueId,
      });

      const enriquecidos = await cargarYEnriquecerRegistros(data);
      setAlimentaciones(enriquecidos);
    } catch (error) {
      mostrarError(error);
      setAlimentaciones([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fincaId && estanqueId) {
      cargarAlimentaciones();
    }
  }, [fincaId, estanqueId]);

  async function eliminarAlimentacion(id) {
    await alimentacionService.deleteById(id);
    await cargarAlimentaciones();
    setAlert("deleted");
  }

  const {
    modalVisible,
    itemSeleccionado: alimentacionSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useModalEliminar(eliminarAlimentacion);

  useEffect(() => {
    onAlertChange?.(alert);
  }, [alert]);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return {
    alimentaciones,
    loading,
    alert,
    modalVisible,
    alimentacionSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
