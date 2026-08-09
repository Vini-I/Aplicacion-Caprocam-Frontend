/**
 * ============================================================
 * HOOK DE FINCA DE CRECIMIENTO
 * ============================================================
 *
 * Registro de peso por muestreo:
 * - Varios cálculos (cantidad de individuos + peso total).
 * - Total (g/Cant) y peso promedio se calculan en front.
 * - Al guardar se envía pesoActual = promedio de los cálculos.
 */

import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import crecimientoService from "../services/mantCrecimiento.service.js";
import { mantCrecmientoDTO } from "../dtos/mantCrecmiento.dto.js";
import { useError } from "../../../shared/context/ErrorContext.js";

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

function calcularPromedio(cantidad, pesoTotal) {
  const c = Number(cantidad);
  const p = Number(pesoTotal);
  if (!c || c <= 0 || Number.isNaN(c) || Number.isNaN(p)) return null;
  return p / c;
}

function formatearPeso(valor) {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return "-";
  return Number(valor).toFixed(2);
}

let calcIdSeq = 1;

export function useFincaCrecimiento() {
  const { mostrarError } = useError();
  const { id } = useLocalSearchParams();
  const parsedId = useMemo(() => {
    if (!id) return null;
    const parsed = parseInt(id, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [id]);

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);
  const [crecimientos, setCrecimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState(getFechaHoy());

  // Cálculos ya agregados (lista)
  const [calculos, setCalculos] = useState([]);
  // Formulario del cálculo actual
  const [cantidadIndividuos, setCantidadIndividuos] = useState("0");
  const [pesoTotal, setPesoTotal] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function cargarDatos() {
    setIsLoading(true);
    setLoadError("");
    try {
      const [fincasData, estanquesData, crecimientosData] = await Promise.all([
        fincaService.getFincas(),
        estanqueService.getEstanques(),
        crecimientoService.getAll(),
      ]);
      setFincas(fincasData);
      setEstanques(estanquesData);
      setCrecimientos(Array.isArray(crecimientosData) ? crecimientosData : []);
    } catch (error) {
      mostrarError(error);
      setLoadError("Ocurrio un error al cargar fincas y estanques");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!successMessage && !errorMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
      setSubmitted(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const searchEstanqueById = useCallback(
    (targetId) => estanques.find((item) => item.id === targetId) ?? null,
    [estanques],
  );

  const estanque = useMemo(() => {
    if (parsedId !== null) return searchEstanqueById(parsedId);
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
    if (!fincaSeleccionada) return [];
    return estanques
      .filter(
        (estanqueItem) => estanqueItem.idFinca === Number(fincaSeleccionada),
      )
      .map((estanqueItem) => ({
        label: estanqueItem.codigo,
        value: estanqueItem.id,
      }));
  }, [fincaSeleccionada, estanques]);

  // Total (g/Cant) del formulario actual
  const totalActual = useMemo(
    () => calcularPromedio(cantidadIndividuos, pesoTotal),
    [cantidadIndividuos, pesoTotal],
  );

  // Peso promedio = media de los totales de cada cálculo guardado
  const pesoPromedioCalculado = useMemo(() => {
    if (!calculos.length) return null;
    const suma = calculos.reduce((acc, c) => acc + Number(c.promedio), 0);
    return suma / calculos.length;
  }, [calculos]);

  const pesoAnteriorLabel = useMemo(() => {
    if (!estanqueSeleccionado) return "Peso anterior: -";

    const delEstanque = (crecimientos || []).filter((c) => {
      const idEst = Number(c.estanque ?? c.estanqueId ?? c.estanque_id);
      return idEst === Number(estanqueSeleccionado);
    });

    if (delEstanque.length === 0) return "Peso anterior: -";

    const ordenados = [...delEstanque].sort((a, b) => {
      const fa = String(a.fechaRegistro ?? a.fecha_registro ?? a.fecha ?? "");
      const fb = String(b.fechaRegistro ?? b.fecha_registro ?? b.fecha ?? "");
      const porFecha = fb.localeCompare(fa);
      if (porFecha !== 0) return porFecha;
      return Number(b.id ?? 0) - Number(a.id ?? 0);
    });

    const ultimo = ordenados[0];
    const peso = ultimo?.pesoActual ?? ultimo?.peso_actual;

    return peso !== undefined && peso !== null && peso !== ""
      ? `Peso anterior: ${peso} g`
      : "Peso anterior: -";
  }, [estanqueSeleccionado, crecimientos]);

  const limpiarFormCalculo = useCallback(() => {
    setCantidadIndividuos("0");
    setPesoTotal("");
    setEditandoId(null);
  }, []);

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

  const handleCantidadChange = useCallback((value) => {
    setCantidadIndividuos(value);
    setSuccessMessage("");
    setErrorMessage("");
  }, []);

  const handlePesoTotalChange = useCallback((value) => {
    setPesoTotal(value);
    setSuccessMessage("");
    setErrorMessage("");
  }, []);

  /** Agrega o actualiza el cálculo actual en la lista */
  const agregarCalculo = useCallback(() => {
    const cant = Number(cantidadIndividuos);
    const peso = Number(pesoTotal);
    if (
      cantidadIndividuos === "" ||
      pesoTotal === "" ||
      Number.isNaN(cant) ||
      Number.isNaN(peso) ||
      cant <= 0 ||
      peso <= 0
    ) {
      setErrorMessage("Cantidad y peso total deben ser mayores que cero.");
      setSubmitted(true);
      return;
    }

    const promedio = calcularPromedio(cantidadIndividuos, pesoTotal);
    if (promedio === null || promedio <= 0) {
      setErrorMessage("Ingrese cantidad y peso total válidos.");
      setSubmitted(true);
      return;
    }

    const item = {
      id: editandoId ?? calcIdSeq++,
      cantidad: Number(cantidadIndividuos),
      pesoTotal: Number(pesoTotal),
      promedio,
    };

    setCalculos((prev) => {
      if (editandoId != null) {
        return prev.map((c) => (c.id === editandoId ? item : c));
      }
      return [...prev, item];
    });

    limpiarFormCalculo();
    setErrorMessage("");
    setErrors((prev) => ({ ...prev, calculos: undefined }));
  }, [cantidadIndividuos, pesoTotal, editandoId, limpiarFormCalculo]);

  const editarCalculo = useCallback((calculo) => {
    setCantidadIndividuos(String(calculo.cantidad));
    setPesoTotal(String(calculo.pesoTotal));
    setEditandoId(calculo.id);
  }, []);

  const eliminarCalculo = useCallback(
    (idCalculo) => {
      setCalculos((prev) => prev.filter((c) => c.id !== idCalculo));
      if (editandoId === idCalculo) {
        limpiarFormCalculo();
      }
    },
    [editandoId, limpiarFormCalculo],
  );

  const quitarCalculoActual = useCallback(() => {
    limpiarFormCalculo();
  }, [limpiarFormCalculo]);

  const validarCampos = useCallback(() => {
    const nextErrors = {};

    if (!fincaSeleccionada) nextErrors.finca = "Seleccione una finca.";
    if (!estanqueSeleccionado) nextErrors.estanque = "Seleccione un estanque.";
    if (!fechaRegistro) nextErrors.fecha = "Seleccione una fecha de registro.";
    if (!calculos.length) {
      nextErrors.calculos = "Agregue al menos un cálculo de muestreo.";
    } else {
      const invalidos = calculos.some(
        (c) => !c.cantidad || Number(c.cantidad) <= 0 || !c.pesoTotal || Number(c.pesoTotal) <= 0,
      );
      if (invalidos) {
        nextErrors.calculos = "Todos los cálculos deben tener cantidad y peso mayores que cero.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [fincaSeleccionada, estanqueSeleccionado, fechaRegistro, calculos]);

  const guardarDatos = useCallback(async () => {
    setSubmitted(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!validarCampos()) {
      setErrorMessage("Rellenar campos obligatorios.");
      return;
    }

    const pesoFinal = pesoPromedioCalculado;
    if (pesoFinal === null || pesoFinal < 0) {
      setErrorMessage("No se pudo calcular el peso promedio.");
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      const crecimientoDTO = new mantCrecmientoDTO({
        finca: Number(fincaSeleccionada),
        estanque: Number(estanqueSeleccionado),
        pesoActual: Number(Number(pesoFinal).toFixed(2)),
        fechaRegistro: convertirFechaParaBackend(fechaRegistro),
        muestreos: calculos.map((c, index) => ({
          cantidad: c.cantidad,
          pesoTotal: c.pesoTotal,
          pesoPromedio: Number(Number(c.promedio).toFixed(2)),
          orden: index + 1,
        })),
      });

      await crecimientoService.create(crecimientoDTO);

      try {
        const actualizados = await crecimientoService.getAll();
        setCrecimientos(Array.isArray(actualizados) ? actualizados : []);
      } catch {
        /* el promedio ya se guardó; la lista local puede refrescarse después */
      }

      setFincaSeleccionada("");
      setEstanqueSeleccionado("");
      setFechaRegistro(getFechaHoy());
      setCalculos([]);
      limpiarFormCalculo();
      setErrors({});

      setSuccessMessage("Guardado exitosamente");
    } catch (error) {
      mostrarError(error);
    } finally {
      setIsSaving(false);
    }
  }, [
    validarCampos,
    pesoPromedioCalculado,
    fincaSeleccionada,
    estanqueSeleccionado,
    fechaRegistro,
    calculos,
    limpiarFormCalculo,
    mostrarError,
  ]);

  const mostrarErrorFinca = submitted && Boolean(errors.finca);
  const mostrarErrorEstanque = submitted && Boolean(errors.estanque);
  const mostrarErrorFecha = submitted && Boolean(errors.fecha);
  const mostrarErrorCalculos = submitted && Boolean(errors.calculos);

  return {
    fincaSeleccionada,
    estanqueSeleccionado,
    fechaRegistro,
    opcionesFincas,
    estanquesFiltrados,
    estanqueSeleccionadoObj,
    estanque,
    setEstanqueSeleccionado: handleEstanqueChange,
    setFechaRegistro: handleFechaRegistroChange,
    handleFincaChange,
    
    calculos,
    cantidadIndividuos,
    pesoTotal,
    totalActual,
    pesoPromedioCalculado,
    editandoId,
    handleCantidadChange,
    handlePesoTotalChange,
    agregarCalculo,
    editarCalculo,
    eliminarCalculo,
    quitarCalculoActual,
    formatearPeso,

    guardarDatos,
    isSaving,
    submitted,
    errors,
    successMessage,
    errorMessage,
    pesoAnteriorLabel,
    mostrarErrorFinca,
    mostrarErrorEstanque,
    mostrarErrorFecha,
    mostrarErrorCalculos,
  };
}