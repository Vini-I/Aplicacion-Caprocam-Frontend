/**
 * ============================================================
 * HOOK USECONTEO
 * ============================================================
 *
 * Maneja un estado local independiente de finca/estanque
 * seleccionados para un flujo de conteo.
 *
 * Nota importante: actualmente NO está conectado a ninguna
 * pantalla de este módulo. useDensidadPoblacional.js mantiene su
 * propio estado duplicado de finca/estanque, por lo que este
 * hook queda huérfano (sin ningún archivo que lo importe). No se
 * elimina ni se fusiona su lógica porque el documento de cambios
 * no lo pidió explícitamente: queda documentado aquí para que el
 * equipo decida si debe eliminarse o unificarse con
 * useDensidadPoblacional.js.
 *
 * Retorna:
 * - finca, estanque: valores seleccionados (o null).
 * - handleFincaChange, handleEstanqueChange: setters.
 *
 * Ejemplo:
 * const { finca, estanque, handleFincaChange } = useConteo();
 */

import { useState } from "react";

export const useConteo = () => {
  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);

  const handleFincaChange = (val) => {
    setFinca(val);
  };

  const handleEstanqueChange = (val) => {
    setEstanque(val);
  };

  return {
    finca,
    estanque,
    handleFincaChange,
    handleEstanqueChange
  };
};