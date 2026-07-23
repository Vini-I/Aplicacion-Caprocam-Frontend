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

import { usePdf } from "../hooks/usePdf";

export default function useFincaDetalle() {
  const { fincas, loading: loadingFincas } = useFinca();
  const { id } = useLocalSearchParams();

  const finca = fincas.find((f) => f.id === Number(id));

  const [estanquesFinca, setEstanquesFinca] = useState([]);

  const [loadingEstanques, setLoadingEstanques] = useState(false);

  useEffect(() => {
    const cargarEstanques = async () => {

      setLoadingEstanques(true);

      try {
        const data = await estanqueService.getEstanques();

        const filtrados = data.filter(
          (e) => e.idFinca === finca?.id
        );

        setEstanquesFinca(filtrados);

      } catch (error) {
        console.error(error);
      } finally {
        setLoadingEstanques(false);
      }
    };

    if (finca) {
      cargarEstanques();
    };
  }, [finca]);

  const { crearPDFFinca, loading: loadingPdf } = usePdf();

  const handleGenerar = () => crearPDFFinca(finca, estanquesFinca);

  return {
    finca,
    estanquesFinca,
    handleGenerar,
    loadingFincas,
    loadingEstanques,
    loadingPdf,
  };
}
