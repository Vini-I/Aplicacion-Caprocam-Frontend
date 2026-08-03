/**
 * ============================================================
 * HOOK DE DETALLE DE FINCA
 * ============================================================
 *
 * Gestiona la información necesaria para mostrar el detalle de
 * una finca seleccionada, obteniendo sus datos y los estanques
 * asociados para generar reportes.
 *
 * Funcionalidad:
 * - Obtiene el código interno de la finca desde los parámetros
 *   de navegación.
 * - Busca la información de la finca seleccionada en el contexto.
 * - Filtra los estanques relacionados con la finca actual.
 * - Permite generar un PDF con la información de la finca.
 * - Controla el estado de carga durante la generación del reporte.
 */
import { useLocalSearchParams } from "expo-router";
import { useFinca } from "../context/FincaContext.js";
import { useEffect, useState } from "react";

import { estanqueService } from "../../estanques/services/estanque.service.js";
import { useEstanque } from "../../estanques/context/EstanqueContext.js";
import { useError } from "../../../shared/context/ErrorContext.js";

import { usePdf } from "../hooks/usePdf";

export default function useFincaDetalle() {
  const { fincas, loading: loadingFincas } = useFinca();
  const { mostrarError } = useError();

  const {
    estanques,
    alert,
    eliminarEstanque,
    loading: loadingEstanques,
  } = useEstanque();

  const { id } = useLocalSearchParams();

  const finca = fincas.find((f) => f.id === Number(id));

  const estanquesFinca = estanques.filter((e) => e.idFinca === finca?.id);

  const [modalVisible, setModalVisible] = useState(false);
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState(null);

  const { crearPDFFinca, loading: loadingPdf } = usePdf();

  const handleGenerar = async () => {
  try {
    // Cargar el detalle completo de cada estanque (incluye equipos)
    const estanquesCompletos = await Promise.all(
      estanquesFinca.map(async (e) => {
        try {
          return await estanqueService.getEstanqueById(e.id);
        } catch {
          return e; // si falla, al menos usa el resumen
        }
      })
    );

    await crearPDFFinca(finca, estanquesCompletos);
  } catch (error) {
    mostrarError("Error al generar el PDF de la finca");
  }
};

  function abrirModalEliminar(estanque) {
    setEstanqueSeleccionado(estanque);
    setModalVisible(true);
  }

  function cancelarEliminar() {
    setModalVisible(false);;
    setEstanqueSeleccionado(null);
  }

  function confirmarEliminar() {
    eliminarEstanque(estanqueSeleccionado.id);
    setModalVisible(false);
    setEstanqueSeleccionado(null);
  }

  return {
    finca,
    estanquesFinca,
    alert,
    handleGenerar,
    loadingFincas,
    loadingEstanques,
    loadingPdf,

    modalVisible,
    estanqueSeleccionado,

    abrirModalEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
