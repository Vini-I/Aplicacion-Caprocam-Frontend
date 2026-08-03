/**
 * ============================================================
 * HOOK useEditarFisicoQuimica
 * ============================================================
 * Calco de useFisicoQuimica orientado a edición desde reportería:
 * carga por id (getLecturaPorId) y guarda con actualizarLectura.
 * Misma API de retorno para que la screen sea idéntica a la original.
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
  sincronizarLecturasLocales,
  validarFormularioFisicoQuimica,
  validarSeleccionAntesDeAgregar,
} from "../services/FisicoQuimicaServices";

function mapearLecturas(lecturas, esDiaNoche = false) {
  return (lecturas ?? []).map((lectura, index) => {
    let etiqueta = String(index + 1);
    if (esDiaNoche) {
      if (index === 0) etiqueta = "Manana (05:00)";
      else if (index === 1) etiqueta = "Tarde (16:00)";
    }
    return { valor: lectura.value, etiqueta };
  });
}

function desmapearLecturas(valor, esDiaNoche = false) {
  if (!Array.isArray(valor)) {
    if (typeof valor === "number") return [valor];
    return [];
  }
  if (!esDiaNoche) {
    return valor.map((lectura) =>
      typeof lectura === "object" && lectura !== null ? lectura.valor : lectura
    );
  }
  let mananaVal = null;
  let tardeVal = null;
  const libres = [];
  for (const item of valor) {
    if (typeof item === "object" && item !== null) {
      const et = String(item.etiqueta || "").toLowerCase();
      if (et.includes("manana") || et.includes("mañana") || et.includes("05:00") || et === "1") {
        mananaVal = item.valor;
      } else if (et.includes("tarde") || et.includes("16:00") || et === "2") {
        tardeVal = item.valor;
      } else {
        libres.push(item.valor);
      }
    } else {
      libres.push(item);
    }
  }
  if (mananaVal !== null || tardeVal !== null) {
    const res = [];
    if (mananaVal !== null) res.push(mananaVal);
    if (tardeVal !== null) res.push(tardeVal);
    return res;
  }
  return valor.map((lectura) =>
    typeof lectura === "object" && lectura !== null ? lectura.valor : lectura
  );
}

function fechaHoyISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function useEditarFisicoQuimica(registroId, onGuardado) {
  const [cargando, setCargando] = useState(true);
  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [opcionesFincas, setOpcionesFincas] = useState([]);
  const [estanquesFiltrados, setEstanquesFiltrados] = useState([]);
  const [fechaRegistro, setFechaRegistro] = useState(fechaHoyISO());

  const [lecturasPh, setLecturasPh] = useState([]);
  const [lecturasSalinidad, setLecturasSalinidad] = useState([]);
  const [lecturasTemp, setLecturasTemp] = useState([]);
  const [lecturasOx, setLecturasOx] = useState([]);
  const [lecturasPhLocal, setLecturasPhLocal] = useState([]);
  const [lecturasSalinidadLocal, setLecturasSalinidadLocal] = useState([]);
  const [lecturasTempLocal, setLecturasTempLocal] = useState([]);
  const [lecturasOxLocal, setLecturasOxLocal] = useState([]);

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
      .catch(() => { });
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
      .catch(() => {
        if (activo) setEstanquesFiltrados([]);
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
        // 1) Leer la lectura
        const lectura = await getLecturaPorId(registroId);
        if (!activo || !lectura) return;

        const fincaId = Number(lectura.fincaId ?? lectura.finca_id);
        const estanqueId = Number(lectura.estanqueId ?? lectura.estanque_id);

        setLecturaIdActual(lectura.id ?? registroId);
        setFechaRegistro(
          lectura.fecha ? String(lectura.fecha).slice(0, 10) : fechaHoyISO()
        );

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
        if (activo) setErrorMessage("No se pudo cargar la lectura.");
      } finally {
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
      if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    };
  }, [registroId]);

  // Sincroniza arrays locales cuando cambian medicionesPorEstanque
  useEffect(() => {
    sincronizarLecturasLocales({
      medicionesPorEstanque,
      setters: {
        ph: setLecturasPhLocal,
        salinidad: setLecturasSalinidadLocal,
        temperatura: setLecturasTempLocal,
        ox: setLecturasOxLocal,
      },
    });
    // también los que se envían
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

  const handlePhChange = useCallback((values) => {
    manejarCambioPh({
      values,
      setters: { ph: setLecturasPh },
      localSetters: { ph: setLecturasPhLocal },
    });
  }, []);

  const handleSalinidadChange = useCallback((values) => {
    manejarCambioSalinidad({
      values,
      setters: { salinidad: setLecturasSalinidad },
      localSetters: { salinidad: setLecturasSalinidadLocal },
    });
  }, []);

  const handleTempChange = useCallback((values) => {
    manejarCambioTemperatura({
      values,
      setters: { temperatura: setLecturasTemp },
      localSetters: { temperatura: setLecturasTempLocal },
    });
  }, []);

  const handleOxChange = useCallback((values) => {
    manejarCambioOxigeno({
      values,
      setters: { ox: setLecturasOx },
      localSetters: { ox: setLecturasOxLocal },
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
        fecha: fechaRegistro,
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
    fechaRegistro,
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
    handlePhChange,
    handleSalinidadChange,
    handleTempChange,
    handleOxChange,
    handleGuardarClick,
    handleIntentoAgregarSinSeleccion,
  };
}
