/**
 * ============================================================
 * HOOK DE DETALLE DE FINCA
 * ============================================================
 *
 * Gestiona la informacion necesaria para mostrar el detalle de
 * una finca seleccionada y sus estanques asociados.
 */

import { useLocalSearchParams } from "expo-router";

import { useFinca } from "../context/FincaContext.js";
import { estanques } from "../screens/EstanqueData";
import { usePdf } from "../hooks/usePdf";

export default function useFincaDetalle() {
  const { fincas } = useFinca();
  const { id } = useLocalSearchParams();

  const finca = fincas.find(function (item) {
    return item.codigoInterno === id;
  });

  let estanquesFinca = [];

  if (finca) {
    estanquesFinca = estanques.filter(function (estanque) {
      return estanque.finca === finca.nombre;
    });
  }

  const { crearPDFFinca, loading } = usePdf();

  function eliminarEstanque(codigoEstanque) {
    for (let index = 0; index < estanques.length; index++) {
      if (estanques[index].codigo === codigoEstanque) {
        estanques.splice(index, 1);
        break;
      }
    }
  }

  function haldleGenerar() {
    crearPDFFinca(finca, estanquesFinca);
  }

  return {
    finca,
    estanquesFinca,
    eliminarEstanque,
    haldleGenerar,
    loading,
  };
}
