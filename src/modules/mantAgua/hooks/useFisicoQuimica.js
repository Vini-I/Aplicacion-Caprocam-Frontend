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
// TODO CRÍTICO — SIN CONFIRMAR: el equipo de API mostró la respuesta
// de GetPorId/GetAll con ph/salinidad/temperatura/oxigenoDisuelto
// como valores planos (ej. "ph": 7.5), no como arreglo. No sabemos
// todavía si el POST/PUT también espera plano ahora, ni cómo se
// registraría más de una lectura por día (día/noche en pH, hasta 5
// en oxígeno) si cada fila de la tabla solo guarda un valor por
// medición. NO cambiar este mapeo hasta que el equipo de API confirme
// el body real que espera crear/actualizar.
function mapearLecturas(lecturas) {
  return (lecturas ?? []).map((lectura, index) => ({
    valor: lectura.value,
    etiqueta: String(index + 1),
  }));
}

// Inverso de mapearLecturas, para precargar el formulario.
// Defensivo por el mismo TODO de arriba: si la API manda un arreglo
// [{valor, etiqueta}] lo convierte a números planos; si manda un
// valor plano (como en el ejemplo que dio API), lo envuelve en un
// arreglo de un elemento para no tronar el RangeCard. Esto es un
// parche temporal, no la solución — falta confirmar el contrato real.
function desmapearLecturas(valor) {
  if (Array.isArray(valor)) return valor.map((lectura) => lectura.valor);
  if (typeof valor === 'number') return [valor];
  return [];
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
          ph: desmapearLecturas(lecturaExistente.ph),
          salinidad: desmapearLecturas(lecturaExistente.salinidad),
          temperatura: desmapearLecturas(lecturaExistente.temperatura),
          ox: desmapearLecturas(lecturaExistente.oxigenoDisuelto),
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
        ph: mapearLecturas(lecturasPh),
        salinidad: mapearLecturas(lecturasSalinidad),
        temperatura: mapearLecturas(lecturasTemp),
        oxigenoDisuelto: mapearLecturas(lecturasOx),
      });
    } catch (error) {
      setErrorMessage('No se pudo guardar la lectura. Intenta de nuevo.');
      return;
    }

    setMostrarAlerta(true);
    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMostrarAlerta(false);
      timerAlertaRef.current = null;
      router.replace('/(drawer)/(tabs)/registros');
    }, 500);
  }, [router, fincaSeleccionada, estanqueSeleccionado, fechaHoy, lecturasPh, lecturasSalinidad, lecturasTemp, lecturasOx]);

  const alEditar = useCallback(async () => {
    try {
      await actualizarLectura(lecturaIdActual, {
        fincaId: fincaSeleccionada,
        estanqueId: estanqueSeleccionado,
        fecha: fechaHoy,
        ph: mapearLecturas(lecturasPh),
        salinidad: mapearLecturas(lecturasSalinidad),
        temperatura: mapearLecturas(lecturasTemp),
        oxigenoDisuelto: mapearLecturas(lecturasOx),
      });
    } catch (error) {
      setErrorMessage('No se pudo actualizar la lectura. Intenta de nuevo.');
      return;
    }

    setMostrarAlertaEdicion(true);
    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMostrarAlertaEdicion(false);
      timerAlertaRef.current = null;
      router.replace('/(drawer)/(tabs)/registros');
    }, 500);
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