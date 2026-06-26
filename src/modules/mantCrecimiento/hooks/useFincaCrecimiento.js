import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { fincas } from "../../finca/screens/FincaData.js";
import { estanques, searchEstanqueById } from "../screens/EstanqueData.js";

export function useFincaCrecimiento() {
  const { id } = useLocalSearchParams();
  const parsedId = useMemo(() => {
    if (!id) return null;
    const parsed = parseInt(id, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [id]);

  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [pesoActual, setPesoActual] = useState("");

  const estanque = useMemo(() => {
    if (parsedId !== null) {
      return searchEstanqueById(parsedId);
    }

    return searchEstanqueById(1);
  }, [parsedId]);

  const estanqueSeleccionadoObj = useMemo(() => {
    if (!estanqueSeleccionado) return null;
    const parsed = parseInt(estanqueSeleccionado, 10);
    return Number.isNaN(parsed) ? null : searchEstanqueById(parsed);
  }, [estanqueSeleccionado]);

  const opcionesFincas = useMemo(
    () =>
      fincas.map((finca) => ({
        label: finca.nombre,
        value: finca.codigoInterno,
      })),
    [],
  );

  const estanquesFiltrados = useMemo(() => {
    if (!fincaSeleccionada) {
      return [];
    }

    const finca = fincas.find((item) => item.codigoInterno === fincaSeleccionada);
    if (!finca) {
      return [];
    }

    return estanques
      .filter((estanqueItem) => estanqueItem.fincaNombre === finca.nombre)
      .map((estanqueItem) => ({
        label: `${estanqueItem.codigo} - ${estanqueItem.nombre}`,
        value: estanqueItem.id.toString(),
      }));
  }, [fincaSeleccionada]);

  const handleFincaChange = useCallback((value) => {
    setFincaSeleccionada(value);
    setEstanqueSeleccionado("");
  }, []);

  const guardarDatos = useCallback(() => {
    // TODO: agregar lógica de guardado aquí
  }, []);

  return {
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoActual,
    opcionesFincas,
    estanquesFiltrados,
    estanqueSeleccionadoObj,
    estanque,
    setEstanqueSeleccionado,
    setPesoActual,
    handleFincaChange,
    guardarDatos,
  };
}
