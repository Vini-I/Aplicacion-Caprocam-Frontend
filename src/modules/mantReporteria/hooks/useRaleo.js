/**
 * ============================================================
 * HOOK DE RALEO
 * ============================================================
 *
 * Autocontenido: carga sus propios registros, maneja el modal
 * de eliminación y el alert de resultado, sin depender de la
 * screen para recargar ni para reenviar callbacks de recarga.
 *
 * Sigue exactamente el mismo patrón que useAlimentacion.
 */
import { useState, useEffect } from "react";
import raleoService from "../../raleo/services/Raleo.service.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { colaboradorService } from "../../colaboradores/services/colaborador.service.js";

export default function useRaleo(fincaId, estanqueId, onAlertChange) {
  const [raleos, setRaleos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarRaleos() {
    try {
      setLoading(true);

      const [data, fincasData, estanquesData, colaboradoresData] = await Promise.all([
        obtenerDetalleReporte({
          tipoRegistro: "raleo",
          fincaId,
          estanqueId,
        }),
        fincaService.getFincas(),
        estanqueService.getEstanques(),
        colaboradorService.getColaboradores(),
      ]);

      const fincasMap = Object.fromEntries(
        fincasData.map((f) => [Number(f.id), f.nombreFinca])
      );
      const estanquesMap = Object.fromEntries(
        estanquesData.map((e) => [Number(e.id), e.codigo])
      );
      const colaboradoresMap = Object.fromEntries(
        colaboradoresData.map((c) => [Number(c.id), c.nombre])
      );

      const enriquecidos = data.map((registro) => ({
        ...registro,
        nombreFinca:
          registro.nombreFinca ||
          fincasMap[Number(registro.idFinca || registro.fincaId || registro.finca_id)] ||
          "No encontrada",
        codigoEstanque:
          registro.codigoEstanque ||
          estanquesMap[Number(registro.idEstanque || registro.estanqueId || registro.estanque_id)] ||
          "No encontrado",
        nombreColaborador:
          registro.nombreColaborador ||
          colaboradoresMap[
            Number(registro.idColaborador || registro.colaboradorId || registro.colaborador_id)
          ] ||
          "No encontrado",
      }));

      setRaleos(enriquecidos);
    } catch (error) {
      console.error("Error al cargar raleos", error);
      setRaleos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fincaId && estanqueId) {
      cargarRaleos();
    }
  }, [fincaId, estanqueId]);

  async function eliminarRaleo(id) {
   await raleoService.deleteById(id);
    await cargarRaleos();
    setAlert("deleted");
  }

  const {
    modalVisible,
    itemSeleccionado: raleoSeleccionado,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useModalEliminar(eliminarRaleo);

  useEffect(() => {
    onAlertChange?.(alert);
  }, [alert]);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return {
    raleos,
    loading,
    alert,

    modalVisible,
    raleoSeleccionado,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
