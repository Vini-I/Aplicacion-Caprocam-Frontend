/**
 * ============================================================
 * HOOK DE CRECIMIENTO
 * ============================================================
 *
 * Autocontenido: carga sus propios registros, maneja el modal
 * de eliminación y el alert de resultado, sin depender de la
 * screen para recargar ni para reenviar callbacks de recarga.
 *
 * Sigue exactamente el mismo patrón que useAlimentacion.
 */
import { useState, useEffect } from "react";
import crecimientoService from "../../mantCrecimiento/services/mantCrecimiento.service.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { colaboradorService } from "../../colaboradores/services/colaborador.service.js";

export default function useCrecimiento(fincaId, estanqueId, onAlertChange) {
  const [crecimientos, setCrecimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarCrecimientos() {
    try {
      setLoading(true);

      const [data, fincasData, estanquesData, colaboradoresData] =
        await Promise.all([
          obtenerDetalleReporte({
            tipoRegistro: "crecimiento",
            fincaId,
            estanqueId,
          }),
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          colaboradorService.getColaboradores(),
        ]);

      const fincasMap = Object.fromEntries(
        fincasData.map((f) => [Number(f.id), f.nombreFinca]),
      );
      const estanquesMap = Object.fromEntries(
        estanquesData.map((e) => [Number(e.id), e.codigo]),
      );
      const colaboradoresMap = Object.fromEntries(
        colaboradoresData.map((c) => [Number(c.id), c.nombre]),
      );

      const enriquecidos = data.map((registro) => ({
        ...registro,
        nombreFinca:
          fincasMap[
            Number(registro.finca_id || registro.fincaId || registro.idFinca)
          ] ?? "No encontrada",
        codigoEstanque:
          estanquesMap[
            Number(
              registro.estanque_id ||
                registro.estanqueId ||
                registro.idEstanque,
            )
          ] ?? "No encontrado",
        nombreColaborador:
          colaboradoresMap[
            Number(
              registro.colaborador_id ||
                registro.colaboradorId ||
                registro.idColaborador,
            )
          ] ?? "No encontrado",
      }));

      setCrecimientos(enriquecidos);
    } catch (error) {
      console.error("Error al cargar crecimientos", error);
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
