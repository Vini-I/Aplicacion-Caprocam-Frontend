/**
 * ============================================================
 * HOOK useFisicoQuimica
 * ============================================================
 *
 * Descripción:
 * Maneja el estado del registro de Físico-Química: selección de finca, estanque y fecha (DateInput),
 * gestión de lecturas de las 4 variables con hora individual (TimeInput 12h AM/PM) y serialización a 24h para el backend.
 *
 * @dependencies FisicoQuimicaServices, dateUtils, ErrorContext
 * @validations Finca, estanque y fecha requeridos (sin fechas futuras); al menos una medición para guardar.
 * @navigation Muestra mensaje de éxito local y resetea el formulario tras guardar.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  guardarLectura,
  actualizarLectura,
  eliminarLectura,
  getLecturaPorEstanqueYFecha,
  manejarCambioFinca,
  manejarCambioOxigeno,
  manejarCambioPh,
  manejarCambioSalinidad,
  manejarCambioTemperatura,
  hayMedicionesRegistradas,
  obtenerEstanquesPorFinca,
  obtenerOpcionesFincas,
  validarFormularioFisicoQuimica,
  validarSeleccionAntesDeAgregar,
} from '../services/FisicoQuimicaServices';
import { useError } from '../../../shared/context/ErrorContext';
import {
  getCurrentDate,
  toMysqlDate,
  formatTime12,
  toMysqlTime,
} from '../../../shared/utils/dateUtils';

// Convierte las lecturas de RangeCard ({id, value, horaMedicion}) al formato que
// espera la API ([{valor, etiqueta, horaMedicion}]).
function mapearLecturas(lecturas, esDiaNoche = false) {
  return (lecturas ?? []).map((lectura, index) => {
    let etiqueta = String(index + 1);
    if (esDiaNoche) {
      if (index === 0) {
        etiqueta = 'Manana (05:00)';
      } else if (index === 1) {
        etiqueta = 'Tarde (16:00)';
      }
    }

    let h12 = (typeof lectura === 'object' && lectura !== null) ? lectura.horaMedicion : null;
    if (!h12 && esDiaNoche) {
      h12 = index === 0 ? "05:00 AM" : "04:00 PM";
    }

    const val = (typeof lectura === 'object' && lectura !== null) ? (lectura.value ?? lectura.valor) : lectura;

    return {
      valor: Number(val) || 0,
      etiqueta,
      horaMedicion: toMysqlTime(h12 || "08:00 AM"),
    };
  });
}

// Inverso de mapearLecturas, para precargar el formulario.
function desmapearLecturas(valor, esDiaNoche = false) {
  if (!Array.isArray(valor)) {
    if (typeof valor === 'number') return [{ value: valor, horaMedicion: esDiaNoche ? "05:00 AM" : "08:00 AM" }];
    return [];
  }

  if (!esDiaNoche) {
    return valor.map((item) => {
      if (typeof item === 'object' && item !== null) {
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
    if (typeof item === 'object' && item !== null) {
      const et = String(item.etiqueta || '').toLowerCase();
      const val = Number(item.valor ?? item.value ?? 0);
      const h24 = item.horaMedicion || item.hora_medicion || "";
      const h12 = h24 ? formatTime12(h24) : "";

      if (et.includes('manana') || et.includes('mañana') || et.includes('05:00') || et === '1') {
        mananaObj = { value: val, horaMedicion: h12 || "05:00 AM" };
      } else if (et.includes('tarde') || et.includes('16:00') || et === '2') {
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
    if (typeof item === 'object' && item !== null) {
      const val = Number(item.valor ?? item.value ?? 0);
      const h24 = item.horaMedicion || item.hora_medicion || "";
      const h12 = h24 ? formatTime12(h24) : (index === 0 ? "05:00 AM" : "04:00 PM");
      return { value: val, horaMedicion: h12 };
    }
    return { value: Number(item) || 0, horaMedicion: index === 0 ? "05:00 AM" : "04:00 PM" };
  });
}

export default function useFisicoQuimica() {
  const { mostrarError } = useError();

  const [estanquesFiltrados, setEstanquesFiltrados] = useState([]);
  const [lecturasPh, setLecturasPh] = useState([]);
  const [lecturasSalinidad, setLecturasSalinidad] = useState([]);
  const [lecturasTemp, setLecturasTemp] = useState([]);
  const [lecturasOx, setLecturasOx] = useState([]);

  const [mensajeExito, setMensajeExito] = useState("");

  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => getCurrentDate());

  const [medicionesPorEstanque, setMedicionesPorEstanque] = useState({
    ph: [],
    salinidad: [],
    temperatura: [],
    ox: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tieneMedicionesExistentes, setTieneMedicionesExistentes] = useState(false);
  const [lecturaIdActual, setLecturaIdActual] = useState(null);

  const [opcionesFincas, setOpcionesFincas] = useState([]);

  const timerAlertaRef = useRef(null);

  const fechaMysql = useMemo(() => {
    return toMysqlDate(fechaSeleccionada) || toMysqlDate(getCurrentDate());
  }, [fechaSeleccionada]);

  useEffect(() => {
    if (!fincaSeleccionada) {
      setEstanquesFiltrados([]);
      return;
    }
    obtenerEstanquesPorFinca(fincaSeleccionada)
      .then(setEstanquesFiltrados)
      .catch((err) => {
        setEstanquesFiltrados([]);
        if (err?.response?.status !== 401) mostrarError(err);
      });
  }, [fincaSeleccionada]);

  useEffect(() => {
    return () => {
      if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    };
  }, []);

  useEffect(() => {
    obtenerOpcionesFincas()
      .then(setOpcionesFincas)
      .catch((err) => {
        setOpcionesFincas([]);
        if (err?.response?.status !== 401) mostrarError(err);
      });
  }, []);

  const tieneAlgunaMedicion = useMemo(
    () =>
      hayMedicionesRegistradas([
        lecturasPh,
        lecturasSalinidad,
        lecturasTemp,
        lecturasOx,
        medicionesPorEstanque.ph,
        medicionesPorEstanque.salinidad,
        medicionesPorEstanque.temperatura,
        medicionesPorEstanque.ox,
      ]),
    [lecturasPh, lecturasSalinidad, lecturasTemp, lecturasOx, medicionesPorEstanque],
  );

  const estanqueSeleccionadoObj = useMemo(
    () =>
      estanquesFiltrados.find((item) => item.value === estanqueSeleccionado) || null,
    [estanqueSeleccionado, estanquesFiltrados],
  );

  const puedeAgregarMediciones = Boolean(fincaSeleccionada && estanqueSeleccionado);

  const handleIntentoAgregarSinSeleccion = useCallback(() => {
    setSubmitted(true);
    setErrorMessage(
      validarSeleccionAntesDeAgregar({ fincaSeleccionada, estanqueSeleccionado }),
    );
  }, [fincaSeleccionada, estanqueSeleccionado]);

  const handleFincaChange = useCallback((value) => {
    manejarCambioFinca({
      value,
      setters: {
        finca: setFincaSeleccionada,
        estanque: setEstanqueSeleccionado,
        mediciones: setMedicionesPorEstanque,
        error: setErrorMessage,
      },
    });
    setTieneMedicionesExistentes(false);
  }, []);

  const handleFechaChange = useCallback((nuevaFecha) => {
    setFechaSeleccionada(nuevaFecha);
    setErrorMessage("");
  }, []);

  const cargarLecturasDeEstanque = useCallback(async (estanqueId, fechaFormato) => {
    if (!estanqueId) return;

    let lecturaExistente = null;
    try {
      lecturaExistente = await getLecturaPorEstanqueYFecha(estanqueId, toMysqlDate(fechaFormato));
    } catch (error) {
      lecturaExistente = null;
    }

    const mediciones = lecturaExistente
      ? {
        ph: desmapearLecturas(lecturaExistente.ph, true),
        salinidad: desmapearLecturas(lecturaExistente.salinidad, true),
        temperatura: desmapearLecturas(lecturaExistente.temperatura, true),
        ox: desmapearLecturas(lecturaExistente.oxigenoDisuelto, false),
      }
      : { ph: [], salinidad: [], temperatura: [], ox: [] };

    setMedicionesPorEstanque(mediciones);
    setLecturaIdActual(lecturaExistente?.id ?? null);
    setTieneMedicionesExistentes(
      hayMedicionesRegistradas([
        mediciones.ph,
        mediciones.salinidad,
        mediciones.temperatura,
        mediciones.ox,
      ]),
    );
  }, []);

  const handleEstanqueChange = useCallback(async (value) => {
    setEstanqueSeleccionado(value);
    setErrorMessage("");
    await cargarLecturasDeEstanque(value, fechaSeleccionada);
  }, [fechaSeleccionada, cargarLecturasDeEstanque]);

  useEffect(() => {
    if (estanqueSeleccionado) {
      cargarLecturasDeEstanque(estanqueSeleccionado, fechaSeleccionada);
    }
  }, [fechaSeleccionada, estanqueSeleccionado, cargarLecturasDeEstanque]);

  const handlePhChange = useCallback((values) => {
    manejarCambioPh({ values, setters: { ph: setLecturasPh } });
  }, []);

  const handleSalinidadChange = useCallback((values) => {
    manejarCambioSalinidad({ values, setters: { salinidad: setLecturasSalinidad } });
  }, []);

  const handleTempChange = useCallback((values) => {
    manejarCambioTemperatura({ values, setters: { temperatura: setLecturasTemp } });
  }, []);

  const handleOxChange = useCallback((values) => {
    manejarCambioOxigeno({ values, setters: { ox: setLecturasOx } });
  }, []);

  const resetearFormulario = useCallback(() => {
    setFincaSeleccionada("");
    setEstanqueSeleccionado("");
    setEstanquesFiltrados([]);
    setFechaSeleccionada(getCurrentDate());
    setMedicionesPorEstanque({ ph: [], salinidad: [], temperatura: [], ox: [] });
    setLecturasPh([]);
    setLecturasSalinidad([]);
    setLecturasTemp([]);
    setLecturasOx([]);
    setTieneMedicionesExistentes(false);
    setLecturaIdActual(null);
    setSubmitted(false);
  }, []);

  const alGuardar = useCallback(async () => {
    try {
      await guardarLectura({
        fincaId: fincaSeleccionada,
        estanqueId: estanqueSeleccionado,
        fecha: fechaMysql,
        ph: mapearLecturas(lecturasPh, true),
        salinidad: mapearLecturas(lecturasSalinidad, true),
        temperatura: mapearLecturas(lecturasTemp, true),
        oxigenoDisuelto: mapearLecturas(lecturasOx, false),
      });
    } catch (error) {
      const msg = error?.message || error?.response?.data?.message || 'No se pudo guardar la lectura. Intenta de nuevo.';
      setErrorMessage(msg);
      return;
    }

    setMensajeExito('¡Mediciones físico-químicas guardadas exitosamente!');
    setErrorMessage('');
    resetearFormulario();

    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMensajeExito('');
      timerAlertaRef.current = null;
    }, 3000);
  }, [fincaSeleccionada, estanqueSeleccionado, fechaMysql, lecturasPh, lecturasSalinidad, lecturasTemp, lecturasOx, resetearFormulario]);

  const alEditar = useCallback(async () => {
    if (!tieneAlgunaMedicion) {
      try {
        await eliminarLectura(lecturaIdActual);
      } catch (error) {
        const msg = error?.message || error?.response?.data?.message || 'No se pudo eliminar la lectura del estanque. Intenta de nuevo.';
        setErrorMessage(msg);
        return;
      }

      setMensajeExito('¡Medición del estanque eliminada exitosamente!');
      setErrorMessage('');
      resetearFormulario();

      if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
      timerAlertaRef.current = setTimeout(() => {
        setMensajeExito('');
        timerAlertaRef.current = null;
      }, 3000);
      return;
    }

    try {
      await actualizarLectura(lecturaIdActual, {
        fincaId: fincaSeleccionada,
        estanqueId: estanqueSeleccionado,
        fecha: fechaMysql,
        ph: mapearLecturas(lecturasPh, true),
        salinidad: mapearLecturas(lecturasSalinidad, true),
        temperatura: mapearLecturas(lecturasTemp, true),
        oxigenoDisuelto: mapearLecturas(lecturasOx, false),
      });
    } catch (error) {
      const msg = error?.message || error?.response?.data?.message || 'No se pudo actualizar la lectura. Intenta de nuevo.';
      setErrorMessage(msg);
      return;
    }

    setMensajeExito('¡Mediciones físico-químicas actualizadas exitosamente!');
    setErrorMessage('');
    resetearFormulario();

    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMensajeExito('');
      timerAlertaRef.current = null;
    }, 3000);
  }, [lecturaIdActual, fincaSeleccionada, estanqueSeleccionado, fechaMysql, lecturasPh, lecturasSalinidad, lecturasTemp, lecturasOx, tieneAlgunaMedicion, resetearFormulario]);

  const handleGuardarClick = useCallback(() => {
    setSubmitted(true);

    const error = validarFormularioFisicoQuimica({
      fincaSeleccionada,
      estanqueSeleccionado,
      tieneAlgunaMedicion,
      tieneMedicionesExistentes,
    });

    setErrorMessage(error);
    if (error) return;

    if (tieneMedicionesExistentes) {
      alEditar();
    } else {
      alGuardar();
    }
  }, [fincaSeleccionada, estanqueSeleccionado, tieneAlgunaMedicion, tieneMedicionesExistentes, alGuardar, alEditar]);

  return {
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
    alEditar,
  };
}