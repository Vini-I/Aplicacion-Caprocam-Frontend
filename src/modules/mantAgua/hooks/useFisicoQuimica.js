/**
 * ============================================================
 * HOOK useFisicoQuimica
 * ============================================================
 *
 * Maneja TODO el estado de la pantalla Físico-Química: selección
 * de finca/estanque, lecturas de las 4 mediciones (locales y las
 * que se envían a RangeCard), validación al guardar, las alertas
 * de "guardado"/"actualizado" con su timer, y la navegación de
 * regreso a /registros tras guardar.
 *
 * ---
 * RETORNA
 * ---
 * fincaSeleccionada         string  — value de la finca elegida
 * estanqueSeleccionado      string  — value del estanque elegido
 * medicionesPorEstanque     obj     — { ph, salinidad, temperatura, ox } precargados
 * submitted                 bool    — true tras el primer intento de guardar
 * errorMessage               string  — mensaje de validación general
 * tieneMedicionesExistentes bool    — true si el estanque ya tenía mediciones
 * tieneAlgunaMedicion       bool    — true si hay al menos una lectura cargada
 * estanquesFiltrados         array   — opciones para el Select de estanque
 * estanqueSeleccionadoObj    obj     — objeto completo del estanque elegido
 * mostrarAlerta              bool    — true mientras se muestra "guardado exitosamente"
 * mostrarAlertaEdicion       bool    — true mientras se muestra "actualizado exitosamente"
 * handleFincaChange          fn      — onChange del Select de finca
 * handleEstanqueChange       fn      — onChange del Select de estanque
 * handlePhChange              fn      — onChange del RangeCard de pH
 * handleSalinidadChange       fn      — onChange del RangeCard de salinidad
 * handleTempChange            fn      — onChange del RangeCard de temperatura
 * handleOxChange               fn      — onChange del RangeCard de oxígeno
 * handleGuardarClick          fn      — valida y dispara alGuardar()
 * alEditar                    fn      — dispara el alert de edición y navega tras 500ms
 *
 * ---
 * RESTRICCIONES
 * ---
 * - No debe renderizar JSX; solo expone estado y handlers a FisicoQuimicaScreen.
 * - No debe manejar navegación directa fuera de alGuardar/alEditar/handleGuardarClick.
 *
 * ---
 * EJEMPLO DE USO
 * ---
 * const { mostrarAlerta, handleGuardarClick, handlePhChange } = useFisicoQuimica();
 *
 * <RangeCard title="pH" onChange={handlePhChange} ... />
 * <Button onPress={handleGuardarClick}>Guardar módulo</Button>
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  guardarLectura,
  actualizarLectura,
  getLecturaPorEstanqueYFecha,
  manejarCambioFinca,
  manejarCambioOxigeno,
  manejarCambioPh,
  manejarCambioSalinidad,
  manejarCambioTemperatura,
  hayMedicionesRegistradas,
  obtenerEstanquesPorFinca,
  obtenerOpcionesFincas,
  sincronizarLecturasLocales,
  validarFormularioFisicoQuimica,
  validarSeleccionAntesDeAgregar,
} from '../services/FisicoQuimicaServices';

// Convierte las lecturas de RangeCard ({id, value}) al formato que
// espera la API ([{valor, etiqueta}]).
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
    return {
      valor: lectura.value,
      etiqueta,
    };
  });
}

// Inverso de mapearLecturas, para precargar el formulario.
function desmapearLecturas(valor, esDiaNoche = false) {
  if (!Array.isArray(valor)) {
    if (typeof valor === 'number') return [valor];
    return [];
  }

  if (!esDiaNoche) {
    return valor.map((lectura) =>
      typeof lectura === 'object' && lectura !== null ? lectura.valor : lectura
    );
  }

  let mananaVal = null;
  let tardeVal = null;
  const libres = [];

  for (const item of valor) {
    if (typeof item === 'object' && item !== null) {
      const et = String(item.etiqueta || '').toLowerCase();
      if (
        et.includes('manana') ||
        et.includes('mañana') ||
        et.includes('05:00') ||
        et === '1'
      ) {
        mananaVal = item.valor;
      } else if (
        et.includes('tarde') ||
        et.includes('16:00') ||
        et === '2'
      ) {
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
    typeof lectura === 'object' && lectura !== null ? lectura.valor : lectura
  );
}

export default function useFisicoQuimica() {

  const [estanquesFiltrados, setEstanquesFiltrados] = useState([]);
  // Lecturas que se envían a guardar/actualizar
  const [lecturasPh, setLecturasPh] = useState([]);
  const [lecturasSalinidad, setLecturasSalinidad] = useState([]);
  const [lecturasTemp, setLecturasTemp] = useState([]);
  const [lecturasOx, setLecturasOx] = useState([]);

  // Alertas de guardado/edición
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarAlertaEdicion, setMostrarAlertaEdicion] = useState(false);

  // Selección de finca/estanque y mediciones precargadas del estanque
  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [medicionesPorEstanque, setMedicionesPorEstanque] = useState({
    ph: [],
    salinidad: [],
    temperatura: [],
    ox: [],
  });

  // Copias locales de las lecturas, usadas para saber si hay al menos una medición
  const [lecturasPhLocal, setLecturasPhLocal] = useState([]);
  const [lecturasSalinidadLocal, setLecturasSalinidadLocal] = useState([]);
  const [lecturasTempLocal, setLecturasTempLocal] = useState([]);
  const [lecturasOxLocal, setLecturasOxLocal] = useState([]);

  // Validación y estado de edición
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tieneMedicionesExistentes, setTieneMedicionesExistentes] = useState(false);
  const [lecturaIdActual, setLecturaIdActual] = useState(null);

  // Opciones de finca, ahora vienen de la API (async)
  const [opcionesFincas, setOpcionesFincas] = useState([]);

  const timerAlertaRef = useRef(null);
  const router = useRouter();
  const fechaHoy = useMemo(() => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }, []);

  useEffect(() => {
    if (!fincaSeleccionada) {
      setEstanquesFiltrados([]);
      return;
    }
    obtenerEstanquesPorFinca(fincaSeleccionada)
      .then(setEstanquesFiltrados)
      .catch(() => setEstanquesFiltrados([]));
  }, [fincaSeleccionada]);

  // Limpia el timer de alertas al desmontar
  useEffect(() => {
    return () => {
      if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    };
  }, []);

  // Sincroniza las lecturas locales cada vez que cambian las mediciones del estanque
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
  }, [medicionesPorEstanque]);

  // Carga las fincas desde la API al montar la pantalla
  useEffect(() => {
    obtenerOpcionesFincas()
      .then(setOpcionesFincas)
      .catch(() => setOpcionesFincas([]));
  }, []);

  const tieneAlgunaMedicion = useMemo(
    () => hayMedicionesRegistradas([
      lecturasPhLocal,
      lecturasSalinidadLocal,
      lecturasTempLocal,
      lecturasOxLocal,
    ]),
    [lecturasPhLocal, lecturasSalinidadLocal, lecturasTempLocal, lecturasOxLocal],
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

  const handleEstanqueChange = useCallback(async (value) => {
    setEstanqueSeleccionado(value);
    setErrorMessage("");

    let lecturaExistente = null;
    try {
      lecturaExistente = await getLecturaPorEstanqueYFecha(value, fechaHoy);
    } catch (error) {
      lecturaExistente = null;
    }

    // La API devuelve "oxigenoDisuelto" (confirmado por API); el front
    // usa "ox" en todo el formulario.
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
  }, [fechaHoy]);

  const handlePhChange = useCallback((values) => {
    manejarCambioPh({ values, setters: { ph: setLecturasPh }, localSetters: { ph: setLecturasPhLocal } });
  }, []);

  const handleSalinidadChange = useCallback((values) => {
    manejarCambioSalinidad({ values, setters: { salinidad: setLecturasSalinidad }, localSetters: { salinidad: setLecturasSalinidadLocal } });
  }, []);

  const handleTempChange = useCallback((values) => {
    manejarCambioTemperatura({ values, setters: { temperatura: setLecturasTemp }, localSetters: { temperatura: setLecturasTempLocal } });
  }, []);

  const handleOxChange = useCallback((values) => {
    manejarCambioOxigeno({ values, setters: { ox: setLecturasOx }, localSetters: { ox: setLecturasOxLocal } });
  }, []);

  const alGuardar = useCallback(async () => {
    try {
      await guardarLectura({
        fincaId: fincaSeleccionada,
        estanqueId: estanqueSeleccionado,
        fecha: fechaHoy,
        ph: mapearLecturas(lecturasPh, true),
        salinidad: mapearLecturas(lecturasSalinidad, true),
        temperatura: mapearLecturas(lecturasTemp, true),
        oxigenoDisuelto: mapearLecturas(lecturasOx, false),
      });
    } catch (error) {
      const msg = error?.response?.data?.message || 'No se pudo guardar la lectura. Intenta de nuevo.';
      setErrorMessage(msg);
      return;
    }

    setMostrarAlerta(true);
    setErrorMessage("");
    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMostrarAlerta(false);
      timerAlertaRef.current = null;
      router.replace({
        pathname: '/(drawer)/(tabs)/registros',
        params: { successMessage: '¡Mediciones físico-químicas guardadas exitosamente!' },
      });
    }, 300);
  }, [router, fincaSeleccionada, estanqueSeleccionado, fechaHoy, lecturasPh, lecturasSalinidad, lecturasTemp, lecturasOx]);

  const alEditar = useCallback(async () => {
    try {
      await actualizarLectura(lecturaIdActual, {
        fincaId: fincaSeleccionada,
        estanqueId: estanqueSeleccionado,
        fecha: fechaHoy,
        ph: mapearLecturas(lecturasPh, true),
        salinidad: mapearLecturas(lecturasSalinidad, true),
        temperatura: mapearLecturas(lecturasTemp, true),
        oxigenoDisuelto: mapearLecturas(lecturasOx, false),
      });
    } catch (error) {
      const msg = error?.response?.data?.message || 'No se pudo actualizar la lectura. Intenta de nuevo.';
      setErrorMessage(msg);
      return;
    }

    setMostrarAlertaEdicion(true);
    setErrorMessage("");
    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMostrarAlertaEdicion(false);
      timerAlertaRef.current = null;
      router.replace({
        pathname: '/(drawer)/(tabs)/registros',
        params: { successMessage: '¡Mediciones físico-químicas actualizadas exitosamente!' },
      });
    }, 300);
  }, [lecturaIdActual, fincaSeleccionada, estanqueSeleccionado, fechaHoy, lecturasPh, lecturasSalinidad, lecturasTemp, lecturasOx, router]);

  // Valida el formulario y, si pasa, dispara el guardado
  const handleGuardarClick = useCallback(() => {
    setSubmitted(true);

    const error = validarFormularioFisicoQuimica({
      fincaSeleccionada,
      estanqueSeleccionado,
      tieneAlgunaMedicion,
    });

    setErrorMessage(error);
    if (error) return;

    alGuardar();
  }, [fincaSeleccionada, estanqueSeleccionado, tieneAlgunaMedicion, alGuardar]);

  return {
    fincaSeleccionada,
    estanqueSeleccionado,
    medicionesPorEstanque,
    submitted,
    errorMessage,
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
    alEditar,
  };
}