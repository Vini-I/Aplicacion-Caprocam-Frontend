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
 *   obligatorios numeroCamarones (no vacío y numérico),
 *   tirosAtarraya (mayor a 0), areaAtarraya, promedioPorTiro,
 *   supervivencia, siembraPorM2 y areaEstanque (no vacíos), sin
 *   mostrar nada en pantalla.
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
    if (!promedioPorTiro) {
      errores.promedioPorTiro = "El promedio por tiro es obligatorio";
    }
    if (!supervivencia) {
      errores.supervivencia = "La supervivencia es obligatoria";
    }
    if (!siembraPorM2) {
      errores.siembraPorM2 = "La cantidad de siembra por m² es obligatoria";
    }
    if (!areaEstanque) {
      errores.areaEstanque = "El área del estanque es obligatoria";
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
