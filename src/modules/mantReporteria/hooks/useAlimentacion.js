/**
 * ============================================================
 * HOOK DE ALIMENTACIÓN
 * ============================================================
 *
 * Autocontenido: carga sus propios registros, maneja el modal
 * de eliminación y el alert de resultado, sin depender de la
 * screen para recargar ni para reenviar callbacks de recarga.
 */
import { useState, useEffect } from "react";
import alimentacionService from "../../alimentacion/services/Alimentacion.service.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";

export default function useAlimentacion(fincaId, estanqueId, onAlertChange) {
  const [alimentaciones, setAlimentaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarAlimentaciones() {
    try {
      setLoading(true);
      const data = await obtenerDetalleReporte({
        tipoRegistro: "alimentacion",
        fincaId,
        estanqueId,
      });
      setAlimentaciones(data);
    } catch (error) {
      console.error("Error al cargar alimentaciones", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarAlimentaciones();
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