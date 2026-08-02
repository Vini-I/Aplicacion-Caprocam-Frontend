/**
 * ============================================================
 * HOOK DE FINCA DE CRECIMIENTO
 * ============================================================
 *
 * Centraliza la lógica de carga de parámetros, filtros y
 * opciones de selección para la pantalla de finca de crecimiento.
 */


import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fincaService } from "../../finca/services/finca.service.js";
import { colaboradorService } from "../../colaboradores/services/colaborador.service.js";

import crecimientoService from "../services/mantCrecimiento.service.js";
import { mantCrecmientoDTO } from "../dtos/mantCrecmiento.dto.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";

function getFechaHoy() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

export function formatearFechaParaInput(hoy) {
  if (!hoy) return getFechaHoy();

  const [anio, mes, dia] = hoy.split("-");

  if (!anio || !mes || !dia) return getFechaHoy();

  return `${dia}/${mes}/${anio}`;
}

export function convertirFechaParaBackend(fechaDDMMYYYY) {
  const [dia, mes, anio] = fechaDDMMYYYY.split("/");
  return `${anio}-${mes}-${dia}`;
}

export function useFincaCrecimiento() {
  const { id } = useLocalSearchParams();
  const parsedId = useMemo(() => {
    if (!id) return null;
    const parsed = parseInt(id, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [id]);

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [pesoActual, setPesoActual] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState(getFechaHoy());

  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const [fincasData, estanquesData, colaboradoresData] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          colaboradorService.getColaboradores(),
        ]);

        setFincas(fincasData);
        setEstanques(estanquesData);
        setColaboradores(colaboradoresData);

      } catch (error) {
        setLoadError("Ocurrio un error al cargar fincas y estanques");
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
    
  }, []);

  const searchEstanqueById = useCallback(
    (targetId) => estanques.find((item) => item.id === targetId) ?? null,
    [estanques],
  );

  const estanque = useMemo(() => {
    if (parsedId !== null) {
      return searchEstanqueById(parsedId);
    }

    return searchEstanqueById(1);
  }, [parsedId, searchEstanqueById]);

  const estanqueSeleccionadoObj = useMemo(() => {
    if (!estanqueSeleccionado) return null;
    const parsed = parseInt(estanqueSeleccionado, 10);
    return Number.isNaN(parsed) ? null : searchEstanqueById(parsed);
  }, [estanqueSeleccionado, searchEstanqueById]);

  const opcionesFincas = useMemo(
    () =>
      fincas.map((finca) => ({
        label: finca.nombreFinca,
        value: finca.id,
      })),
    [fincas],
  );

  const estanquesFiltrados = useMemo(() => {
    if (!fincaSeleccionada) {
      return [];
    }

    return estanques
      .filter((estanqueItem) => estanqueItem.idFinca === Number(fincaSeleccionada))
      .map((estanqueItem) => ({
        label: estanqueItem.codigo,
        value: estanqueItem.id,
      }));
  }, [fincaSeleccionada, estanques]);

  const opcionesColaboradores = useMemo(
    () => 
      colaboradores.map((colaborador) => ({
    label: colaborador.nombre,
    value: colaborador.id,
  })),
    [colaboradores]
  );

  const handleColaboradorChange = useCallback(
    (value) => {
      setColaboradorSeleccionado(value);

      setErrors((prev) => ({
        ...prev,
        colaborador: undefined,
      }));
    },
    []
  );

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

    if (!colaboradorSeleccionado) {
      nextErrors.colaborador = "Seleccione un colaborador";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [fincaSeleccionada, estanqueSeleccionado, pesoActual, fechaRegistro, colaboradorSeleccionado]);

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

  const guardarDatos = useCallback(async () => {
    setSubmitted(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!validarCampos()) {
      setErrorMessage("Rellenar campos obligatorios.");
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      const crecimientoDTO = new mantCrecmientoDTO({
        finca: Number(fincaSeleccionada),
        estanque: Number(estanqueSeleccionado),
        pesoActual: Number(pesoActual),
        fechaRegistro: convertirFechaParaBackend(fechaRegistro),
        colaborador: Number(colaboradorSeleccionado),
      });

      await crecimientoService.create(crecimientoDTO);

      setSuccessMessage("Guardado exitosamente");

    } catch (error) {
      setErrorMessage("Ocurrio un error al guardar el crecimiento");
    } finally {
      setIsSaving(false);
    }
  }, [validarCampos, fincaSeleccionada, estanqueSeleccionado, pesoActual, fechaRegistro]);

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
  const mostrarErrorColaborador = submitted && Boolean(errors.colaborador);

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

    opcionesColaboradores,
    colaboradorSeleccionado,
    handleColaboradorChange ,

    isSaving,
    submitted,
    errors,
    successMessage,
    errorMessage,
    pesoAnteriorLabel,
    mostrarErrorFinca,
    mostrarErrorEstanque,
    mostrarErrorPeso,
    mostrarErrorFecha,
    mostrarErrorColaborador
  };
}
