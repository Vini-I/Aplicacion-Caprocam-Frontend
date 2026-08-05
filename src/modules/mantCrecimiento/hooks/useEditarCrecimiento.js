/**
 * Calco de useFincaCrecimiento orientado a edición (getById + update).
 * Misma forma de retorno para que EditarCrecimientoScreen sea idéntica a la original.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import crecimientoService from "../services/mantCrecimiento.service.js";
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

export default function useEditarCrecimiento(registroId, onGuardado) {
    const { mostrarError } = useError();
const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [pesoActual, setPesoActual] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const [fincasData, estanquesData] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
        ]);
        if (!activo) return;
        setFincas(fincasData || []);
        setEstanques(estanquesData || []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { activo = false; };
  }, []);

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
        setEstanqueSeleccionado(String(r.estanque ?? r.estanqueId ?? r.estanque_id ?? ""));
        setPesoActual(String(r.pesoActual ?? r.peso_actual ?? ""));
        setFechaRegistro(formatearFechaParaUI(r.fechaRegistro ?? r.fecha_registro ?? r.fecha));
      })
      .catch((e) => {
        if (activo) mostrarError(e);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => { activo = false; };
  }, [registroId]);

  const searchEstanqueById = useCallback(
    (targetId) => estanques.find((item) => Number(item.id) === Number(targetId)) ?? null,
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
      .filter((e) => Number(e.idFinca ?? e.fincaId) === Number(fincaSeleccionada))
      .map((e) => ({ label: e.codigo, value: e.id }));
  }, [fincaSeleccionada, estanques]);

  const handleFincaChange = useCallback((value) => {
    setFincaSeleccionada(value);
    setEstanqueSeleccionado("");
    setErrors((prev) => ({ ...prev, finca: undefined, estanque: undefined }));
    setSuccessMessage("");
    setErrorMessage("");
  }, []);

  const validarCampos = useCallback(() => {
    const next = {};
    if (!fincaSeleccionada) next.finca = "Seleccione una finca.";
    if (!estanqueSeleccionado) next.estanque = "Seleccione un estanque.";
    if (!pesoActual || Number(pesoActual) <= 0) next.peso = "Ingrese un peso actual válido.";
    if (!fechaRegistro) next.fecha = "Seleccione una fecha de registro.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [fincaSeleccionada, estanqueSeleccionado, pesoActual, fechaRegistro]);

  const guardarDatos = useCallback(async () => {
    setSubmitted(true);
    setSuccessMessage("");
    setErrorMessage("");
    if (!validarCampos()) {
      setErrorMessage("Rellenar campos obligatorios.");
      return;
    }
    setIsSaving(true);
    try {
      await crecimientoService.update(registroId, {
        finca: Number(fincaSeleccionada),
        estanque: Number(estanqueSeleccionado),
        pesoActual: Number(pesoActual),
        fechaRegistro: convertirFechaParaBackend(fechaRegistro),
        colaborador: null,
      });
      setSuccessMessage("Actualizado exitosamente");
      onGuardado?.();
    } catch (e) {
      // Error fuera del formulario → ModalError (ErrorContext)
      setErrorMessage(error.message)
    } finally {
      setIsSaving(false);
    }
  }, [validarCampos, fincaSeleccionada, estanqueSeleccionado, pesoActual, fechaRegistro, registroId, onGuardado]);

  const [crecimientos, setCrecimientos] = useState([]);

  useEffect(() => {
    let activo = true;
    crecimientoService
      .getAll()
      .then((data) => {
        if (activo) setCrecimientos(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (activo) setCrecimientos([]);
      });
    return () => {
      activo = false;
    };
  }, []);

  // Peso anterior = último registro de ese estanque (excluye el actual)
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
      return fb.localeCompare(fa);
    });

    const ultimo = ordenados[0];
    const peso = ultimo?.pesoActual ?? ultimo?.peso_actual;

    return peso !== undefined && peso !== null && peso !== ""
      ? `Peso anterior: ${peso} g`
      : "Peso anterior: -";
  }, [estanqueSeleccionado, crecimientos, registroId]);

  return {
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoActual,
    fechaRegistro,
    opcionesFincas,
    estanquesFiltrados,
    estanqueSeleccionadoObj,
    estanque: estanqueSeleccionadoObj,

    setEstanqueSeleccionado,
    setPesoActual,
    setFechaRegistro,
    handleFincaChange,
    guardarDatos,

    isSaving,
    submitted,
    errors,
    successMessage,
    errorMessage,
    pesoAnteriorLabel,
    mostrarErrorFinca: submitted && Boolean(errors.finca),
    mostrarErrorEstanque: submitted && Boolean(errors.estanque),
    mostrarErrorPeso: submitted && Boolean(errors.peso),
    mostrarErrorFecha: submitted && Boolean(errors.fecha),
    cargando,
  };
}