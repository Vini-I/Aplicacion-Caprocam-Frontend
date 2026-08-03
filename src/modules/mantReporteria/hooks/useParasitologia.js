/**
 * ============================================================
 * HOOK DE PARASITOLOGÍA
 * ============================================================
 *
 * Autocontenido: carga, eliminación y alert.
 * Enriquece: nombreFinca, codigoEstanque, nombreColaborador, nombreCreadoPor
 */
import { useState, useEffect } from "react";
import parasitologiaService from "../../parasitologia/services/ParasitologiaService.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";
import { cargarYEnriquecerRegistros } from "../utils/enriquecerRegistros.js";
import { useError } from "../../../shared/context/ErrorContext.js";

export default function useParasitologia(fincaId, estanqueId, onAlertChange) {
  const [parasitologia, setParasitologia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const { mostrarError } = useError();

  async function cargarParasitologia() {
    try {
      setLoading(true);

      const data = await obtenerDetalleReporte({
        tipoRegistro: "parasitologia",
        fincaId,
        estanqueId,
      });

      const enriquecidos = await cargarYEnriquecerRegistros(data);
      setParasitologia(enriquecidos);
    } catch (error) {
      mostrarError(error);
      setParasitologia([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fincaId && estanqueId) {
      cargarParasitologia();
    }
  }, [fincaId, estanqueId]);

  async function eliminarParasitologia(id) {
    await parasitologiaService.deleteById(id);
    await cargarParasitologia();
    setAlert("deleted");
  }

  const {
    modalVisible,
    itemSeleccionado: parasitologiaSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useModalEliminar(eliminarParasitologia);

  useEffect(() => {
    onAlertChange?.(alert);
  }, [alert]);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return {
    parasitologia,
    loading,
    alert,
    modalVisible,
    parasitologiaSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
