/**
 * ============================================================
 * HOOK DE FINCA DE CRECIMIENTO
 * ============================================================
 *
 * Centraliza la lógica de carga de parámetros, filtros y
 * opciones de selección para la pantalla de finca de crecimiento.
 */


import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { fincas } from "../../finca/screens/FincaData.js";
import { estanques, searchEstanqueById } from "../services/EstanqueData.js";

function getFechaHoy() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

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
  const [fechaRegistro, setFechaRegistro] = useState(getFechaHoy());

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const validarCampos = useCallback(() => {
    const nextErrors = {};

    if (!fincaSeleccionada) {
      nextErrors.finca = "Seleccione una finca.";
    }

    if (!estanqueSeleccionado) {
      nextErrors.estanque = "Seleccione un estanque.";
    }

    if (!pesoActual || Number(pesoActual) <= 0) {
      nextErrors.peso = "Ingrese un peso actual válido.";
    }

    if (!fechaRegistro) {
      nextErrors.fecha = "Seleccione una fecha de registro.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [fincaSeleccionada, estanqueSeleccionado, pesoActual, fechaRegistro]);

  const handleFincaChange = useCallback((value) => {
    setFincaSeleccionada(value);
    setEstanqueSeleccionado("");
    setErrors((prev) => ({ ...prev, finca: undefined, estanque: undefined }));
    setSuccessMessage("");
    setErrorMessage("");
  }, []);

  const handleEstanqueChange = useCallback(
    (value) => {
      setEstanqueSeleccionado(value);
      setSuccessMessage("");
      setErrorMessage("");
      if (submitted) {
        setErrors((prev) => ({ ...prev, estanque: undefined }));
      }
    },
    [submitted],
  );

  const handlePesoActualChange = useCallback(
    (value) => {
      setPesoActual(value);
      setSuccessMessage("");
      setErrorMessage("");
      if (submitted) {
        setErrors((prev) => ({ ...prev, peso: undefined }));
      }
    },
    [submitted],
  );

  const handleFechaRegistroChange = useCallback(
    (value) => {
      setFechaRegistro(value);
      setSuccessMessage("");
      setErrorMessage("");
      if (submitted) {
        setErrors((prev) => ({ ...prev, fecha: undefined }));
      }
    },
    [submitted],
  );

  const guardarDatos = useCallback(() => {
    setSubmitted(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!validarCampos()) {
      setErrorMessage("Rellenar campos obligatorios.");
      return;
    }

    setErrors({});
    setSuccessMessage("Guardado exitoso.");
  }, [validarCampos]);

  const pesoAnteriorLabel = useMemo(() => {
    const pesoSemanaAnterior = estanqueSeleccionadoObj?.pesoSemanaAnterior;

    return pesoSemanaAnterior !== undefined && pesoSemanaAnterior !== null
      ? `Peso anterior: ${pesoSemanaAnterior} g`
      : "Peso anterior: -";
  }, [estanqueSeleccionadoObj]);

  const mostrarErrorFinca = submitted && Boolean(errors.finca);
  const mostrarErrorEstanque = submitted && Boolean(errors.estanque);
  const mostrarErrorPeso = submitted && Boolean(errors.peso);
  const mostrarErrorFecha = submitted && Boolean(errors.fecha);

  return {
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoActual,
    fechaRegistro,
    opcionesFincas,
    estanquesFiltrados,
    estanqueSeleccionadoObj,
    estanque,
    setEstanqueSeleccionado: handleEstanqueChange,
    setPesoActual: handlePesoActualChange,
    setFechaRegistro: handleFechaRegistroChange,
    handleFincaChange,
    guardarDatos,
    submitted,
    errors,
    successMessage,
    errorMessage,
    pesoAnteriorLabel,
    mostrarErrorFinca,
    mostrarErrorEstanque,
    mostrarErrorPeso,
    mostrarErrorFecha,
  };
}
