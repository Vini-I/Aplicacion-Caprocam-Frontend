/**
 * ============================================================
 * RUTA PRINCIPAL DE TRAZABILIDAD
 * ============================================================
 *
 * Conecta TrazabilidadScreen con las pantallas reales de cada modulo.
 */

import TrazabilidadScreen from "../../../modules/trazabilidad/screens/TrazabilidadScreen";
import { useRouter } from "expo-router";

export default function TrazabilidadIndex() {
  const router = useRouter();

  const irAAgregarTrazabilidad = () => {
    router.push("/trazabilidad/agregar");
  };

  const irADetalle = () => {
    router.push("/trazabilidad/detalle");
  };

  return (
    <TrazabilidadScreen
      onAgregar={irAAgregarTrazabilidad}
      onDetalle={irADetalle}
    />
  );
}
