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
 * opcionesFincas             array   — opciones para el Select de finca
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
  manejarCambioEstanque,
  manejarCambioFinca,
  manejarCambioOxigeno,
  manejarCambioPh,
  manejarCambioSalinidad,
  manejarCambioTemperatura,
  hayMedicionesRegistradas,
  obtenerEstanquesPorFinca,
  obtenerLecturasPorEstanque,
  obtenerOpcionesFincas,
  sincronizarLecturasLocales,
  validarFormularioFisicoQuimica,
  validarSeleccionAntesDeAgregar,
} from '../services/FisicoQuimicaServices';

export default function useFisicoQuimica() {
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

  const timerAlertaRef = useRef(null);
  const router = useRouter();

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

  const tieneAlgunaMedicion = useMemo(
    () => hayMedicionesRegistradas([
      lecturasPhLocal,
      lecturasSalinidadLocal,
      lecturasTempLocal,
      lecturasOxLocal,
    ]),
    [lecturasPhLocal, lecturasSalinidadLocal, lecturasTempLocal, lecturasOxLocal],
  );

  const opcionesFincas = useMemo(() => obtenerOpcionesFincas(), []);

  const estanquesFiltrados = useMemo(
    () => obtenerEstanquesPorFinca(fincaSeleccionada),
    [fincaSeleccionada],
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

  const handleEstanqueChange = useCallback((value) => {
    manejarCambioEstanque({
      value,
      setters: {
        estanque: setEstanqueSeleccionado,
        mediciones: setMedicionesPorEstanque,
        error: setErrorMessage,
      },
      obtenerLecturas: obtenerLecturasPorEstanque,
    });

    const lecturasExistentes = obtenerLecturasPorEstanque(value);
    setTieneMedicionesExistentes(
      hayMedicionesRegistradas([
        lecturasExistentes?.ph,
        lecturasExistentes?.salinidad,
        lecturasExistentes?.temperatura,
        lecturasExistentes?.ox,
      ]),
    );
  }, []);

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

  const alGuardar = useCallback(() => {
    guardarLectura({
      ph: lecturasPh,
      salinidad: lecturasSalinidad,
      temperatura: lecturasTemp,
      oxigeno: lecturasOx,
    });
    setMostrarAlerta(true);
    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMostrarAlerta(false);
      timerAlertaRef.current = null;
      router.replace('/(drawer)/(tabs)/registros');
    }, 500);
  }, [router, lecturasPh, lecturasSalinidad, lecturasTemp, lecturasOx]);

  const alEditar = useCallback(() => {
    setMostrarAlertaEdicion(true);
    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMostrarAlertaEdicion(false);
      timerAlertaRef.current = null;
      router.replace('/(drawer)/(tabs)/registros');
    }, 500);
  }, [router]);

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
    mostrarAlerta,
    mostrarAlertaEdicion,
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