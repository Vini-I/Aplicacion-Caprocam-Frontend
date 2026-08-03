/**
 * ============================================================
 * HOOK DE DENSIDAD POBLACIONAL
 * ============================================================
 *
 * Autocontenido: carga sus propios registros, maneja el modal
 * de eliminación y el alert de resultado, sin depender de la
 * screen para recargar ni para reenviar callbacks de recarga.
 *
 * Sigue exactamente el mismo patrón que useAlimentacion.
 */
import { useState, useEffect } from "react";
import densidadPoblacionalService from "../../densidadPoblacional/services/DensidadPoblacional.service.js";
import { obtenerDetalleReporte } from "../services/detalleReporte.service.js";
import useModalEliminar from "../hooks/useModalEliminar.js";

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";

export default function useDensidadPoblacional(fincaId, estanqueId, onAlertChange) {
  const [densidades, setDensidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  async function cargarDensidades() {
    try {
      setLoading(true);

      const [data, fincasData, estanquesData] = await Promise.all([
        obtenerDetalleReporte({
          tipoRegistro: "densidad_poblacional",
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
        nombreFinca:
          registro.nombreFinca ||
          fincasMap[Number(registro.idFinca || registro.fincaId || registro.finca_id)] ||
          "No encontrada",
        codigoEstanque:
          registro.codigoEstanque ||
          estanquesMap[Number(registro.idEstanque || registro.estanqueId || registro.estanque_id)] ||
          "No encontrado",
        usuarioNombre:
          registro.usuarioNombre || registro.nombreColaborador || "No encontrado",
      }));

      setDensidades(enriquecidos);
    } catch (error) {
      console.error("Error al cargar densidades poblacionales", error);
      setDensidades([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fincaId && estanqueId) {
      cargarDensidades();
    }
  }, [fincaId, estanqueId]);

  async function eliminarDensidad(id) {
    await densidadPoblacionalService.deleteById(id);
    await cargarDensidades();
    setAlert("deleted");
  }

  const {
    modalVisible,
    itemSeleccionado: densidadSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useModalEliminar(eliminarDensidad);

  useEffect(() => {
    onAlertChange?.(alert);
  }, [alert]);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  return {
    densidades,
    loading,
    alert,

    modalVisible,
    densidadSeleccionada,
    loadingEliminar,
    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
