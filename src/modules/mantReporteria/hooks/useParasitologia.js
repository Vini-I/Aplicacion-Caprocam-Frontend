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

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";

export default function useParasitologia(fincaId, estanqueId, onAlertChange) {
  const [parasitologia, setParasitologia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarParasitologia() {
    try {
      setLoading(true);

      const [data, fincasData, estanquesData] = await Promise.all([
        obtenerDetalleReporte({
          tipoRegistro: "parasitologia",
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

      setParasitologia(enriquecidos);

    } catch (error) {
      console.error("Error al cargar parasitología", error);
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