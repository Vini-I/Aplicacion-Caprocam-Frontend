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
import { estanques } from "../screens/EstanqueData";
import { usePdf } from "../hooks/usePdf";

export default function useFincaDetalle() {
  const { fincas, loading: loadingFincas } = useFinca();
  const { id } = useLocalSearchParams();

  const finca = fincas.find((f) => f.id === Number(id));

  const estanquesFinca = finca
    ? estanques.filter((e) => e.finca === finca.nombreFinca)
    : [];

  const { crearPDFFinca, loading: loadingPdf } = usePdf();

  const haldleGenerar = () => crearPDFFinca(finca, estanquesFinca);

  return {
    finca,
    estanquesFinca,
    haldleGenerar,
    loadingFincas,
    loadingPdf,
  };
}
