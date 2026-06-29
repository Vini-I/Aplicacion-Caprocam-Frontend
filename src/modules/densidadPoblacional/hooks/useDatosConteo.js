import { useState } from "react";

export const useDatosConteo = () => {
  const [numeroCamarones, setNumeroCamarones] = useState("");
  const [tirosAtarraya, setTirosAtarraya] = useState("");
  const [areaAtarraya, setAreaAtarraya] = useState("");
  const [promedioPorTiro, setPromedioPorTiro] = useState("");
  const [sobrevivencia, setSobrevivencia] = useState("");
  const [notasConteo, setNotasConteo] = useState("");

  return {
    numeroCamarones,
    tirosAtarraya,
    areaAtarraya,
    promedioPorTiro,
    sobrevivencia,
    notasConteo,

    setNumeroCamarones,
    setTirosAtarraya,
    setAreaAtarraya,
    setPromedioPorTiro,
    setSobrevivencia,
    setNotasConteo,
  };
};