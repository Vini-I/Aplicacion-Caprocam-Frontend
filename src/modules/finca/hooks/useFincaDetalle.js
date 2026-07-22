/**
 * ============================================================
 * HOOK DE DETALLE DE FINCA
 * ============================================================
 *
 * Gestiona la informacion necesaria para mostrar el detalle de
 * una finca seleccionada y sus estanques asociados.
 */

import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { useFinca } from "../context/FincaContext.js";
import { usePdf } from "../hooks/usePdf";
import {
  buscarFincaPorId,
  eliminarEstanqueLocal,
  obtenerEstanquesFinca,
} from "../services/FincaDetalleService.js";

export default function useFincaDetalle() {
  const { fincas, loading: loadingFincas } = useFinca();
  const { id } = useLocalSearchParams();
  const { crearPDFFinca, loading: loadingPdf } = usePdf();

  const [estanquesFinca, setEstanquesFinca] = useState([]);

  const finca = buscarFincaPorId(fincas, id);

  useEffect(
    function () {
      setEstanquesFinca(obtenerEstanquesFinca(finca));
    },
    [finca, fincas],
  );

  function eliminarEstanque(codigoEstanque) {
    eliminarEstanqueLocal(codigoEstanque);

    setEstanquesFinca(function (listaActual) {
      return listaActual.filter(function (estanque) {
        return estanque.codigo !== codigoEstanque;
      });
    });
  }

  function haldleGenerar() {
    crearPDFFinca(finca, estanquesFinca);
  }

  return {
    finca,
    estanquesFinca,
    eliminarEstanque,
    haldleGenerar,
    loadingFincas,
    loadingPdf,
  };
}
