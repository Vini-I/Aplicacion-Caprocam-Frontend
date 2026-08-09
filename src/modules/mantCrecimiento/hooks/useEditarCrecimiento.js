/**
 * ============================================================
 * HOOK EDITAR CRECIMIENTO (muestreo)
 * ============================================================
 * Misma lógica de muestreo que useFincaCrecimiento, con getById + update.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import crecimientoService from "../services/mantCrecimiento.service.js";
import { mantCrecmientoDTO } from "../dtos/mantCrecmiento.dto.js";
import { useError } from "../../../shared/context/ErrorContext.js";

function convertirFechaParaBackend(fechaDDMMYYYY) {
  if (!fechaDDMMYYYY) return "";
  if (fechaDDMMYYYY.includes("-") && !fechaDDMMYYYY.includes("/")) {
    return fechaDDMMYYYY.slice(0, 10);
  }
  const [dia, mes, anio] = fechaDDMMYYYY.split("/");
  return `${anio}-${mes}-${dia}`;
}

function formatearFechaParaUI(fecha) {
  if (!fecha) return "";
  if (typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [y, m, d] = fecha.slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
  }
  return fecha;
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

function mapearMuestreosDesdeApi(registro) {
  const lista =
    registro?.muestreos ??
    registro?.Muestreos ??
    registro?.crecimientoMuestreos ??
    [];

  if (Array.isArray(lista) && lista.length > 0) {
    return lista.map((m, index) => {
      const cantidad = Number(m.cantidad ?? m.cantidadIndividuos ?? 0);
      const pesoTotal = Number(m.pesoTotal ?? m.peso_total ?? 0);
      const promedioRaw =
        m.pesoPromedio ?? m.peso_promedio ?? calcularPromedio(cantidad, pesoTotal);
      return {
        id: m.id ?? index + 1,
        cantidad,
        pesoTotal,
        promedio: Number(promedioRaw),
      };
    });
  }

  // Registro antiguo solo con pesoActual: un cálculo sintético para no perder el valor
  const peso = registro?.pesoActual ?? registro?.peso_actual;
  if (peso !== undefined && peso !== null && peso !== "") {
    const n = Number(peso);
    return [
      {
        id: 1,
        cantidad: 1,
        pesoTotal: n,
        promedio: n,
      },
    ];
  }

  return [];
}

let calcIdSeq = 1000;

export default function useEditarCrecimiento(registroId, onGuardado) {
  const { mostrarError } = useError();

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);
  const [crecimientos, setCrecimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");

  const [calculos, setCalculos] = useState([]);
  const [cantidadIndividuos, setCantidadIndividuos] = useState("0");
  const [pesoTotal, setPesoTotal] = useState("0");
  const [editandoId, setEditandoId] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const [fincasData, estanquesData, crecimientosData] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          crecimientoService.getAll(),
        ]);
        if (!activo) return;
        setFincas(fincasData || []);
        setEstanques(estanquesData || []);
        setCrecimientos(Array.isArray(crecimientosData) ? crecimientosData : []);
      } catch (e) {
        mostrarError(e);
      }
    })();
    return () => {
      activo = false;
    };
  }, [mostrarError]);

  useEffect(() => {
    if (!registroId) {
      setCargando(false);
      return;
    }
    let activo = true;
    setCargando(true);
    crecimientoService
      .getById(registroId)
      .then((r) => {
        if (!activo || !r) return;
        setFincaSeleccionada(String(r.finca ?? r.fincaId ?? r.finca_id ?? ""));
        setEstanqueSeleccionado(
          String(r.estanque ?? r.estanqueId ?? r.estanque_id ?? ""),
        );
        setFechaRegistro(
          formatearFechaParaUI(r.fechaRegistro ?? r.fecha_registro ?? r.fecha),
        );
        setCalculos(mapearMuestreosDesdeApi(r));
        setCantidadIndividuos("0");
        setPesoTotal("0");
        setEditandoId(null);
      })
      .catch((e) => {
        if (activo) mostrarError(e);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [registroId, mostrarError]);

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
    (targetId) =>
      estanques.find((item) => Number(item.id) === Number(targetId)) ?? null,
    [estanques],
  );

  const estanqueSeleccionadoObj = useMemo(() => {
    if (!estanqueSeleccionado) return null;
    return searchEstanqueById(estanqueSeleccionado);
  }, [estanqueSeleccionado, searchEstanqueById]);

  const opcionesFincas = useMemo(
    () => fincas.map((f) => ({ label: f.nombreFinca, value: f.id })),
    [fincas],
  );

  const estanquesFiltrados = useMemo(() => {
    if (!fincaSeleccionada) return [];
    return estanques
      .filter(
        (e) => Number(e.idFinca ?? e.fincaId) === Number(fincaSeleccionada),
      )
      .map((e) => ({ label: e.codigo, value: e.id }));
  }, [fincaSeleccionada, estanques]);

  const totalActual = useMemo(
    () => calcularPromedio(cantidadIndividuos, pesoTotal),
    [cantidadIndividuos, pesoTotal],
  );

  const pesoPromedioCalculado = useMemo(() => {
    if (!calculos.length) return null;
    const suma = calculos.reduce((acc, c) => acc + Number(c.promedio), 0);
    return suma / calculos.length;
  }, [calculos]);

  const pesoAnteriorLabel = useMemo(() => {
    if (!estanqueSeleccionado) return "Peso anterior: -";

    const delEstanque = (crecimientos || []).filter((c) => {
      if (registroId != null && String(c.id) === String(registroId)) return false;
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
  }, [estanqueSeleccionado, crecimientos, registroId]);

  const limpiarFormCalculo = useCallback(() => {
    setCantidadIndividuos("0");
    setPesoTotal("0");
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
    setErrors((prev) => ({ ...prev, cantidad: undefined }));
  }, []);

  const handlePesoTotalChange = useCallback((value) => {
    setPesoTotal(value);
    setSuccessMessage("");
    setErrorMessage("");
    setErrors((prev) => ({ ...prev, pesoTotal: undefined }));
  }, []);

  const agregarCalculo = useCallback(() => {
    const cant = Number(cantidadIndividuos);
    const peso = Number(pesoTotal);
    const nextFieldErrors = {};

    if (cantidadIndividuos === "" || Number.isNaN(cant) || cant <= 0) {
      nextFieldErrors.cantidad = "Ingrese una cantidad mayor que cero.";
    }
    if (pesoTotal === "" || Number.isNaN(peso) || peso <= 0) {
      nextFieldErrors.pesoTotal = "Ingrese un peso total mayor que cero.";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextFieldErrors }));
      setErrorMessage("Cantidad y peso total deben ser mayores que cero.");
      setSubmitted(true);
      return;
    }

    const promedio = calcularPromedio(cantidadIndividuos, pesoTotal);
    if (promedio === null || promedio <= 0) {
      setErrors((prev) => ({
        ...prev,
        cantidad: "Ingrese una cantidad válida.",
        pesoTotal: "Ingrese un peso total válido.",
      }));
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
    const next = {};
    if (!fincaSeleccionada) next.finca = "Seleccione una finca.";
    if (!estanqueSeleccionado) next.estanque = "Seleccione un estanque.";
    if (!fechaRegistro) next.fecha = "Seleccione una fecha de registro.";
    if (!calculos.length) {
      const cant = Number(cantidadIndividuos);
      const peso = Number(pesoTotal);
      const formLleno =
        cantidadIndividuos !== "" &&
        pesoTotal !== "" &&
        !Number.isNaN(cant) &&
        !Number.isNaN(peso) &&
        cant > 0 &&
        peso > 0;

      if (formLleno) {
        next.calculos =
          "Debe agregar el cálculo  para poder guardarlo.";
      } else {
        next.calculos = "Agregue al menos un cálculo de muestreo.";
        if (cantidadIndividuos === "" || Number.isNaN(cant) || cant <= 0) {
          next.cantidad = "Ingrese una cantidad mayor que cero.";
        }
        if (pesoTotal === "" || Number.isNaN(peso) || peso <= 0) {
          next.pesoTotal = "Ingrese un peso total mayor que cero.";
        }
      }
    } else {
      const invalidos = calculos.some(
        (c) => !c.cantidad || Number(c.cantidad) <= 0 || !c.pesoTotal || Number(c.pesoTotal) <= 0,
      );
      if (invalidos) {
        next.calculos = "Todos los cálculos deben tener cantidad y peso mayores que cero.";
      }
    }
    setErrors(next);
    const keys = Object.keys(next);
    if (keys.length === 0) {
      return { ok: true, mensaje: "" };
    }
    const mensaje =
      next.calculos ||
      next.finca ||
      next.estanque ||
      next.fecha ||
      "Rellenar campos obligatorios.";
    return { ok: false, mensaje };
  }, [fincaSeleccionada, estanqueSeleccionado, fechaRegistro, calculos, cantidadIndividuos, pesoTotal]);

  const guardarDatos = useCallback(async () => {
    setSubmitted(true);
    setSuccessMessage("");
    setErrorMessage("");

    const validacion = validarCampos();
    if (!validacion.ok) {
      setErrorMessage(validacion.mensaje);
      return;
    }

    const pesoFinal = pesoPromedioCalculado;
    if (pesoFinal === null || pesoFinal < 0) {
      setErrorMessage("No se pudo calcular el peso promedio.");
      return;
    }

    if (!registroId) {
      setErrorMessage("No se encontró el registro a editar.");
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

      await crecimientoService.update(registroId, crecimientoDTO);

      setErrors({});
      setSubmitted(false);
      setSuccessMessage("Guardado exitosamente");
      onGuardado?.();
    } catch (e) {
      mostrarError(e);
    } finally {
      setIsSaving(false);
    }
  }, [
    validarCampos,
    pesoPromedioCalculado,
    registroId,
    fincaSeleccionada,
    estanqueSeleccionado,
    fechaRegistro,
    calculos,
    onGuardado,
    mostrarError,
  ]);

  return {
    fincaSeleccionada,
    estanqueSeleccionado,
    fechaRegistro,
    opcionesFincas,
    estanquesFiltrados,
    estanqueSeleccionadoObj,
    estanque: estanqueSeleccionadoObj,
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
    mostrarErrorFinca: submitted && Boolean(errors.finca),
    mostrarErrorEstanque: submitted && Boolean(errors.estanque),
    mostrarErrorFecha: submitted && Boolean(errors.fecha),
    mostrarErrorCalculos: submitted && Boolean(errors.calculos),
    mostrarErrorCantidad: submitted && Boolean(errors.cantidad),
    mostrarErrorPesoTotal: submitted && Boolean(errors.pesoTotal),
    cargando,
  };
}
