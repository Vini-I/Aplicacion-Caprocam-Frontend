/**
 * ============================================================
 * HOOK useEditarFisicoQuimica
 * ============================================================
 *
 * Descripción:
 * Maneja el flujo de edición para lecturas de Físico-Química: carga por ID (getLecturaPorId),
 * actualización de fecha (DateInput), horas individuales por medición (TimeInput 12h AM/PM) y persistencia (actualizarLectura).
 *
 * @dependencies FisicoQuimicaServices, dateUtils, ErrorContext
 * @validations Finca, estanque y fecha requeridos; al menos una medición para guardar.
 * @navigation Notifica guardado mediante callback `onGuardado`.
 */
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  actualizarLectura,
  getLecturaPorId,
  manejarCambioFinca,
  manejarCambioOxigeno,
  manejarCambioPh,
  manejarCambioSalinidad,
  manejarCambioTemperatura,
  obtenerEstanquesPorFinca,
  obtenerOpcionesFincas,
  validarFormularioFisicoQuimica,
  validarSeleccionAntesDeAgregar,
} from "../services/FisicoQuimicaServices";
import { useError } from "../../../shared/context/ErrorContext.js";
import {
  formatDate,
  getCurrentDate,
  toMysqlDate,
  formatTime12,
  toMysqlTime,
} from "../../../shared/utils/dateUtils.js";

function mapearLecturas(lecturas, esDiaNoche = false) {
  return (lecturas ?? []).map((lectura, index) => {
    let etiqueta = String(index + 1);
    if (esDiaNoche) {
      if (index === 0) etiqueta = "Manana (05:00)";
      else if (index === 1) etiqueta = "Tarde (16:00)";
    }

    let h12 = (typeof lectura === "object" && lectura !== null) ? lectura.horaMedicion : null;
    if (!h12 && esDiaNoche) {
      h12 = index === 0 ? "05:00 AM" : "04:00 PM";
    }

    const val = (typeof lectura === "object" && lectura !== null) ? (lectura.value ?? lectura.valor) : lectura;

    return {
      valor: Number(val) || 0,
      etiqueta,
      horaMedicion: toMysqlTime(h12 || "08:00 AM"),
    };
  });
}

function desmapearLecturas(valor, esDiaNoche = false) {
  if (!Array.isArray(valor)) {
    if (typeof valor === "number") return [{ value: valor, horaMedicion: esDiaNoche ? "05:00 AM" : "08:00 AM" }];
    return [];
  }

  if (!esDiaNoche) {
    return valor.map((item) => {
      if (typeof item === "object" && item !== null) {
        const val = Number(item.valor ?? item.value ?? 0);
        const h24 = item.horaMedicion || item.hora_medicion || "";
        const h12 = h24 ? formatTime12(h24) : "08:00 AM";
        return { value: val, horaMedicion: h12 };
      }
      return { value: Number(item) || 0, horaMedicion: "08:00 AM" };
    });
  }

  let mananaObj = null;
  let tardeObj = null;
  const libres = [];

  for (const item of valor) {
    if (typeof item === "object" && item !== null) {
      const et = String(item.etiqueta || "").toLowerCase();
      const val = Number(item.valor ?? item.value ?? 0);
      const h24 = item.horaMedicion || item.hora_medicion || "";
      const h12 = h24 ? formatTime12(h24) : "";

      if (et.includes("manana") || et.includes("mañana") || et.includes("05:00") || et === "1") {
        mananaObj = { value: val, horaMedicion: h12 || "05:00 AM" };
      } else if (et.includes("tarde") || et.includes("16:00") || et === "2") {
        tardeObj = { value: val, horaMedicion: h12 || "04:00 PM" };
      } else {
        libres.push({ value: val, horaMedicion: h12 || "08:00 AM" });
      }
    } else {
      libres.push({ value: Number(item) || 0, horaMedicion: "08:00 AM" });
    }
  }

  if (mananaObj !== null || tardeObj !== null) {
    const res = [];
    if (mananaObj !== null) res.push(mananaObj);
    if (tardeObj !== null) res.push(tardeObj);
    return res;
  }

  return valor.map((item, index) => {
    if (typeof item === "object" && item !== null) {
      const val = Number(item.valor ?? item.value ?? 0);
      const h24 = item.horaMedicion || item.hora_medicion || "";
      const h12 = h24 ? formatTime12(h24) : (index === 0 ? "05:00 AM" : "04:00 PM");
      return { value: val, horaMedicion: h12 };
    }
    return { value: Number(item) || 0, horaMedicion: index === 0 ? "05:00 AM" : "04:00 PM" };
  });
}

export default function useEditarFisicoQuimica(registroId, onGuardado) {
  const { mostrarError } = useError();
  const [cargando, setCargando] = useState(true);
  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [opcionesFincas, setOpcionesFincas] = useState([]);
  const [estanquesFiltrados, setEstanquesFiltrados] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => getCurrentDate());

  const [lecturasPh, setLecturasPh] = useState([]);
  const [lecturasSalinidad, setLecturasSalinidad] = useState([]);
  const [lecturasTemp, setLecturasTemp] = useState([]);
  const [lecturasOx, setLecturasOx] = useState([]);

  const [medicionesPorEstanque, setMedicionesPorEstanque] = useState({
    ph: [],
    salinidad: [],
    temperatura: [],
    ox: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [tieneMedicionesExistentes, setTieneMedicionesExistentes] = useState(true);
  const [lecturaIdActual, setLecturaIdActual] = useState(null);
  const timerAlertaRef = useRef(null);

  // Carga catálogo de fincas
  useEffect(() => {
    let activo = true;
    obtenerOpcionesFincas()
      .then((opts) => {
        if (activo) setOpcionesFincas(Array.isArray(opts) ? opts : []);
      })
      .catch((err) => {
        if (activo) {
          setOpcionesFincas([]);
          if (err?.response?.status !== 401) mostrarError(err);
        }
      });
    return () => {
      activo = false;
    };
  }, []);

  // Estanques al cambiar finca
  useEffect(() => {
    if (!fincaSeleccionada && fincaSeleccionada !== 0) {
      setEstanquesFiltrados([]);
      return;
    }
    let activo = true;

    obtenerEstanquesPorFinca(Number(fincaSeleccionada))
      .then((opts) => {
        if (activo) setEstanquesFiltrados(Array.isArray(opts) ? opts : []);
      })
      .catch((err) => {
        if (activo) {
          setEstanquesFiltrados([]);
          if (err?.response?.status !== 401) mostrarError(err);
        }
      });
    return () => {
      activo = false;
    };
  }, [fincaSeleccionada]);

  useEffect(() => {
    if (!registroId) {
      setCargando(false);
      return;
    }
    let activo = true;
    setCargando(true);

    (async () => {
      try {
        const lectura = await getLecturaPorId(registroId);
        if (!activo || !lectura) return;

        const fincaId = Number(lectura.fincaId ?? lectura.finca_id);
        const estanqueId = Number(lectura.estanqueId ?? lectura.estanque_id);

        setLecturaIdActual(lectura.id ?? registroId);
        if (lectura.fecha) {
          setFechaSeleccionada(formatDate(lectura.fecha));
        }

        const opts = await obtenerEstanquesPorFinca(fincaId);
        if (!activo) return;

        setEstanquesFiltrados(Array.isArray(opts) ? opts : []);

        setFincaSeleccionada(fincaId);
        setEstanqueSeleccionado(estanqueId);

        const mediciones = {
          ph: desmapearLecturas(lectura.ph, true),
          salinidad: desmapearLecturas(lectura.salinidad, true),
          temperatura: desmapearLecturas(lectura.temperatura, true),
          ox: desmapearLecturas(lectura.oxigenoDisuelto, false),
        };
        setMedicionesPorEstanque(mediciones);
        setTieneMedicionesExistentes(true);
      } catch (e) {
        if (activo) {
          setErrorMessage("No se pudo cargar la lectura.");
          if (e?.response?.status !== 401) mostrarError(e);
        }
      } finally {
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
      if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    };
  }, [registroId]);

  useEffect(() => {
    setLecturasPh(
      (medicionesPorEstanque.ph ?? []).map((v, i) =>
        typeof v === "object" ? v : { id: `ph-${i}`, value: v }
      )
    );
    setLecturasSalinidad(
      (medicionesPorEstanque.salinidad ?? []).map((v, i) =>
        typeof v === "object" ? v : { id: `sal-${i}`, value: v }
      )
    );
    setLecturasTemp(
      (medicionesPorEstanque.temperatura ?? []).map((v, i) =>
        typeof v === "object" ? v : { id: `temp-${i}`, value: v }
      )
    );
    setLecturasOx(
      (medicionesPorEstanque.ox ?? []).map((v, i) =>
        typeof v === "object" ? v : { id: `ox-${i}`, value: v }
      )
    );
  }, [medicionesPorEstanque]);

  const estanqueSeleccionadoObj = useMemo(
    () =>
      estanquesFiltrados.find(
        (item) => String(item.value) === String(estanqueSeleccionado)
      ) || null,
    [estanqueSeleccionado, estanquesFiltrados]
  );

  const tieneAlgunaMedicion = useMemo(() => {
    return (
      (lecturasPh?.length || 0) +
      (lecturasSalinidad?.length || 0) +
      (lecturasTemp?.length || 0) +
      (lecturasOx?.length || 0) >
      0
    );
  }, [lecturasPh, lecturasSalinidad, lecturasTemp, lecturasOx]);

  const puedeAgregarMediciones = Boolean(fincaSeleccionada && estanqueSeleccionado);

  const handleIntentoAgregarSinSeleccion = useCallback(() => {
    const error = validarSeleccionAntesDeAgregar({
      fincaSeleccionada,
      estanqueSeleccionado,
    });
    if (error) setErrorMessage(error);
  }, [fincaSeleccionada, estanqueSeleccionado]);

  const handleFincaChange = useCallback((value) => {
    manejarCambioFinca({
      value,
      setters: {
        finca: setFincaSeleccionada,
        estanque: setEstanqueSeleccionado,
      },
    });
    setErrorMessage("");
  }, []);

  const handleEstanqueChange = useCallback((value) => {
    setEstanqueSeleccionado(value);
    setErrorMessage("");
  }, []);

  const handleFechaChange = useCallback((nuevaFecha) => {
    setFechaSeleccionada(nuevaFecha);
    setErrorMessage("");
  }, []);

  const handlePhChange = useCallback((values) => {
    manejarCambioPh({
      values,
      setters: { ph: setLecturasPh },
    });
  }, []);

  const handleSalinidadChange = useCallback((values) => {
    manejarCambioSalinidad({
      values,
      setters: { salinidad: setLecturasSalinidad },
    });
  }, []);

  const handleTempChange = useCallback((values) => {
    manejarCambioTemperatura({
      values,
      setters: { temperatura: setLecturasTemp },
    });
  }, []);

  const handleOxChange = useCallback((values) => {
    manejarCambioOxigeno({
      values,
      setters: { ox: setLecturasOx },
    });
  }, []);

  const handleGuardarClick = useCallback(async () => {
    setSubmitted(true);
    const error = validarFormularioFisicoQuimica({
      fincaSeleccionada,
      estanqueSeleccionado,
      tieneAlgunaMedicion,
      tieneMedicionesExistentes: true,
    });
    setErrorMessage(error || "");
    if (error) return;

    try {
      await actualizarLectura(lecturaIdActual || registroId, {
        fincaId: fincaSeleccionada,
        estanqueId: estanqueSeleccionado,
        fecha: toMysqlDate(fechaSeleccionada),
        ph: mapearLecturas(lecturasPh, true),
        salinidad: mapearLecturas(lecturasSalinidad, true),
        temperatura: mapearLecturas(lecturasTemp, true),
        oxigenoDisuelto: mapearLecturas(lecturasOx, false),
      });
      setMensajeExito("¡Mediciones físico-químicas actualizadas exitosamente!");
      setErrorMessage("");
      if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
      timerAlertaRef.current = setTimeout(() => {
        setMensajeExito("");
        onGuardado?.();
      }, 1500);
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "No se pudo actualizar la lectura. Intenta de nuevo.";
      setErrorMessage(msg);
    }
  }, [
    fincaSeleccionada,
    estanqueSeleccionado,
    tieneAlgunaMedicion,
    lecturaIdActual,
    registroId,
    fechaSeleccionada,
    lecturasPh,
    lecturasSalinidad,
    lecturasTemp,
    lecturasOx,
    onGuardado,
  ]);

  return {
    cargando,
    fincaSeleccionada,
    estanqueSeleccionado,
    fechaSeleccionada,
    medicionesPorEstanque,
    submitted,
    errorMessage,
    mensajeExito,
    tieneMedicionesExistentes,
    tieneAlgunaMedicion,
    puedeAgregarMediciones,
    opcionesFincas,
    estanquesFiltrados,
    estanqueSeleccionadoObj,
    handleFincaChange,
    handleEstanqueChange,
    handleFechaChange,
    handlePhChange,
    handleSalinidadChange,
    handleTempChange,
    handleOxChange,
    handleGuardarClick,
    handleIntentoAgregarSinSeleccion,
  };
}

