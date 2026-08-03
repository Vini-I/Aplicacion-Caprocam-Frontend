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

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";

export default function useAlimentacion(fincaId, estanqueId, onAlertChange) {
  const [alimentaciones, setAlimentaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarAlimentaciones() {
    try {
      setLoading(true);

      const [data, fincasData, estanquesData] = await Promise.all([
        obtenerDetalleReporte({
          tipoRegistro: "alimentacion",
          fincaId,
          estanqueId,
        }),
        fincaService.getFincas(),
        estanqueService.getEstanques(),
      ]);

      const fincasMap = Object.fromEntries(
        fincasData.map((f) => [Number(f.id), f.nombreFinca])
      );
      const estanquesMap = Object.fromEntries(
        estanquesData.map((e) => [Number(e.id), e.codigo])
      );

      const enriquecidos = data.map((registro) => ({
        ...registro,
        nombreFinca: registro.nombreFinca || fincasMap[Number(registro.idFinca || registro.fincaId || registro.finca_id)] || "No encontrada",
        codigoEstanque: registro.codigoEstanque || estanquesMap[Number(registro.idEstanque || registro.estanqueId || registro.estanque_id)] || "No encontrado",
      }));

      setAlimentaciones(enriquecidos);
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