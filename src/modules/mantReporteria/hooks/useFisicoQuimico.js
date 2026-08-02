/**
 * ============================================================
 * HOOK DE FÍSICO-QUÍMICO (REPORTERÍA)
 * ============================================================
 *
 * Autocontenido: carga sus propios registros, maneja el modal
 * de eliminación y el alert de resultado, sin depender de la
 * screen para recargar ni para reenviar callbacks de recarga.
 *
 * Sigue exactamente el mismo patrón que useCrecimiento / useAlimentacion.
 */
import { useState, useEffect } from "react";
import {
  getLecturas,
  eliminarLectura,
} from "../../mantAgua/services/FisicoQuimicaServices.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";

export default function useFisicoQuimico(fincaId, estanqueId, onAlertChange) {
  const [lecturas, setLecturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarLecturas() {
    try {
      setLoading(true);

      const [data, fincasData, estanquesData] = await Promise.all([
        obtenerDetalleReporte({
          tipoRegistro: "fisico_quimico",
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

      const enriquecidos = (Array.isArray(data) ? data : []).map((registro) => ({
        ...registro,
        nombreFinca:
          fincasMap[
            Number(registro.fincaId ?? registro.finca_id ?? registro.finca)
          ] ?? "No encontrada",
        codigoEstanque:
          estanquesMap[
            Number(
              registro.estanqueId ?? registro.estanque_id ?? registro.estanque
            )
          ] ?? "No encontrado",
      }));

      setLecturas(enriquecidos);
    } catch (error) {
      console.error("Error al cargar lecturas físico-químicas", error);
      setLecturas([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fincaId && estanqueId) {
      cargarLecturas();
    }
  }, [fincaId, estanqueId]);

  async function eliminarRegistro(id) {
    await eliminarLectura(id);
    await cargarLecturas();
    setAlert("deleted");
  }

  const {
    modalVisible,
    itemSeleccionado: lecturaSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useModalEliminar(eliminarRegistro);

  useEffect(() => {
    onAlertChange?.(alert);
  }, [alert]);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return {
    lecturas,
    loading,
    alert,

    modalVisible,
    lecturaSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
