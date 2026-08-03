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

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";

export default function useEnfermedad(fincaId, estanqueId, onAlertChange) {
  const [enfermedades, setEnfermedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarEnfermedades() {
    try {
      setLoading(true);

      const [data, fincasData, estanquesData] = await Promise.all([
        obtenerDetalleReporte({
          tipoRegistro: "enfermedades",
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
        nombreColaborador: registro.responsable || "No encontrado",
      }));

      setEnfermedades(enriquecidos);
    } catch (error) {
      console.error("Error al cargar enfermedades", error);
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