/**
 * ============================================================
 * HOOK DE PARSITIOLOGÍA
 * ============================================================
 * 
 * Autocontenido: carga sus propios registros, maneja el modal
 * de eliminación y el alert de resultado, sin depender de la
 * screen para recargar ni para reenviar callbacks de recarga.
 */
import { useState, useEffect } from "react";
import parasitologiaService from "../../parasitologia/services/ParasitologiaService.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";

export default function useParasitologia(fincaId, estanqueId, onAlertChange) {
  const [parasitologia, setParasitologia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarParasitologia() {
    try {
      setLoading(true);
      const data = await obtenerDetalleReporte({
        tipoRegistro: "parasitologia",
        fincaId,
        estanqueId,
      });
      setParasitologia(data);
    } catch (error) {
      console.error("Error al cargar parasitología", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarParasitologia();
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