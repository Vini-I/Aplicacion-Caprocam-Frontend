/**
 * ============================================================
 * HOOK DE ENFERMEDADES
 * ============================================================
 * 
 * Autocontenido: carga sus propios registros, maneja el modal
 * de eliminación y el alert de resultado, sin depender de la
 * screen para recargar ni para reenviar callbacks de recarga.
 */
import { useState, useEffect } from "react";
import enfermedadesService from "../../enfermedades/services/EnfermedadesService.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";

export default function useEnfermedad(fincaId, estanqueId, onAlertChange) {
  const [enfermedades, setEnfermedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarEnfermedades() {
    try {
      setLoading(true);
      const data = await obtenerDetalleReporte({
        tipoRegistro: "enfermedades",
        fincaId,
        estanqueId,
      });
      setEnfermedades(data);
    } catch (error) {
      console.error("Error al cargar enfermedades", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarEnfermedades();
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