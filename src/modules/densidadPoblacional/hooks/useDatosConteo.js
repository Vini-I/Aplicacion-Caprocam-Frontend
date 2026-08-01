/**
 * ============================================================
 * HOOK USEDATOSCONTEO
 * ============================================================
 *
 * Maneja el estado de los datos de conteo con atarraya (número
 * de camarones, tiros, área de la atarraya, promedio por tiro,
 * supervivencia y notas) y de los datos base del estanque
 * usados para calcular la densidad poblacional (siembra por m²
 * y área del estanque). No muestra ni renderiza nada en
 * pantalla: la interfaz decide cuándo mostrar los errores
 * devueltos por validar().
 *
 * Estado que maneja:
 * - numeroCamarones, tirosAtarraya, areaAtarraya, promedioPorTiro,
 *   supervivencia: datos obligatorios del conteo con atarraya.
 * - notasConteo: dato opcional (si queda vacío,
 *   useDensidadPoblacional.js lo completa con un texto por
 *   defecto antes de guardar, no se valida aquí).
 * - siembraPorM2, areaEstanque: datos del estanque, obligatorios
 *   para calcular la densidad.
 *
 * Nota: el campo se llama `supervivencia` (antes decía
 * "sobrevivencia", que no es la palabra correcta en español).
 *
 * Retorna:
 * - todos los valores anteriores junto con sus setters.
 * - validar(): retorna { valido, errores } verificando como
 *   obligatorios y numéricos numeroCamarones, promedioPorTiro,
 *   supervivencia, siembraPorM2 y areaEstanque; tirosAtarraya
 *   (mayor a 0) y areaAtarraya (no vacío), sin mostrar nada en
 *   pantalla.
 *
 * Ejemplo:
 * const { numeroCamarones, setNumeroCamarones, validar } = useDatosConteo();
 */

import { useState } from "react";

export const useDatosConteo = () => {
  const [numeroCamarones, setNumeroCamarones] = useState("");
  const [tirosAtarraya, setTirosAtarraya] = useState("");
  const [areaAtarraya, setAreaAtarraya] = useState("");
  const [promedioPorTiro, setPromedioPorTiro] = useState("");
  const [supervivencia, setSupervivencia] = useState("");
  const [notasConteo, setNotasConteo] = useState("");
  const [siembraPorM2, setSiembraPorM2] = useState("");
  const [areaEstanque, setAreaEstanque] = useState("");

  const validar = () => {
    const errores = {};

    if (!numeroCamarones || Number.isNaN(Number(numeroCamarones))) {
      errores.numeroCamarones = "El número de camarones contados es obligatorio y debe ser numérico";
    }
    if (!(Number(tirosAtarraya) > 0)) {
      errores.tirosAtarraya = "Los tiros de atarraya deben ser mayor a 0";
    }
    if (!areaAtarraya) {
      errores.areaAtarraya = "El área de la atarraya es obligatoria";
    }
    if (!promedioPorTiro || Number.isNaN(Number(promedioPorTiro))) {
      errores.promedioPorTiro = "El promedio por tiro es obligatorio y debe ser numérico";
    }
    if (!supervivencia || Number.isNaN(Number(supervivencia))) {
      errores.supervivencia = "La supervivencia es obligatoria y debe ser numérica";
    }
    if (!siembraPorM2 || Number.isNaN(Number(siembraPorM2))) {
      errores.siembraPorM2 = "La cantidad de siembra por m² es obligatoria y debe ser numérica";
    }
    if (!areaEstanque || Number.isNaN(Number(areaEstanque))) {
      errores.areaEstanque = "El área del estanque es obligatoria y debe ser numérica";
    }
    if (!notasConteo) {
      errores.notasConteo = "Las notas o comentarios del conteo son obligatorios";
    }

    return { valido: Object.keys(errores).length === 0, errores };
  };

  return {
    numeroCamarones,
    tirosAtarraya,
    areaAtarraya,
    promedioPorTiro,
    supervivencia,
    notasConteo,
    siembraPorM2,
    areaEstanque,

    setNumeroCamarones,
    setTirosAtarraya,
    setAreaAtarraya,
    setPromedioPorTiro,
    setSupervivencia,
    setNotasConteo,
    setSiembraPorM2,
    setAreaEstanque,

    validar,
  };
};
