/**
 * ============================================================
 * HOOK USEDATOSCONTEO
 * ============================================================
 *
 * Maneja el estado de los datos de conteo con atarraya (numero
 * de camarones, tiros, area de la atarraya, promedio por tiro,
 * supervivencia y notas) y de los datos base del estanque
 * usados para calcular la densidad poblacional (siembra por metro cuadrado
 * y area del estanque). No muestra ni renderiza nada en
 * pantalla: la interfaz decide cuando mostrar los errores
 * devueltos por validar().
 *
 * Estado que maneja:
 * - numeroCamarones, tirosAtarraya, areaAtarraya, promedioPorTiro,
 *   supervivencia: datos obligatorios del conteo con atarraya.
 * - notasConteo: dato opcional. Si queda vacio, no se marca como
 *   error (validar() no lo exige): useDensidadPoblacional.js lo
 *   completa con un texto por defecto ("No hay notas") antes de
 *   guardar.
 * - siembraPorM2, areaEstanque: datos del estanque, obligatorios
 *   para calcular la densidad.
 *
 * Nota: el campo se llama `supervivencia` (antes decia
 * "sobrevivencia", que no es la palabra correcta en espanol).
 *
 * Retorna:
 * - todos los valores anteriores junto con sus setters.
 * - validar(): retorna { valido, errores } verificando como
 *   obligatorios y numericos numeroCamarones, promedioPorTiro,
 *   supervivencia, siembraPorM2 y areaEstanque; tirosAtarraya
 *   (mayor a 0) y areaAtarraya (no vacio), sin mostrar nada en
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
      errores.numeroCamarones = "El numero de camarones contados es obligatorio y debe ser numerico";
    }
    if (!(Number(tirosAtarraya) > 0)) {
      errores.tirosAtarraya = "Los tiros de atarraya deben ser mayor a 0";
    }
    if (!areaAtarraya) {
      errores.areaAtarraya = "El area de la atarraya es obligatoria";
    }
    if (!promedioPorTiro || Number.isNaN(Number(promedioPorTiro))) {
      errores.promedioPorTiro = "El promedio por tiro es obligatorio y debe ser numerico";
    }
    if (!supervivencia || Number.isNaN(Number(supervivencia))) {
      errores.supervivencia = "La supervivencia es obligatoria y debe ser numerica";
    }
    if (!siembraPorM2 || Number.isNaN(Number(siembraPorM2))) {
      errores.siembraPorM2 = "La cantidad de siembra por metro cuadrado es obligatoria y debe ser numerica";
    }
    if (!areaEstanque || Number.isNaN(Number(areaEstanque))) {
      errores.areaEstanque = "El area del estanque es obligatoria y debe ser numerica";
    }
    // notasConteo es opcional: no se valida aqui (ver comentario de
    // cabecera). useDensidadPoblacional.js completa "No hay notas"
    // si queda vacio antes de guardar.

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
