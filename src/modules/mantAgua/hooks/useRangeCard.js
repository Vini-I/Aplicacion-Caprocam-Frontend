/**
 * ============================================================
 * HOOK useRangeCard
 * ============================================================
 *
 * Descripción:
 * Maneja el estado de las lecturas de RangeCard: agregar/quitar
 * filas, clamping de valores dentro de sliderMin/sliderMax, incremento/decremento
 * funcional en tiempo real para avance continuo (hold) y evaluación de zonas.
 *
 * @dependencies react
 * @validations Limita lecturas entre min/max, redondeo a decimales e idealMin/idealMax.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

const limitar = (val, min, max) => Math.min(Math.max(val, min), max);
const formatear = (val, decimals) => val.toFixed(decimals);

function crearLectura(id, value, decimals) {
  return { id, value, rawInput: formatear(value, decimals), editing: false };
}

// Convierte valores iniciales en objetos de lectura reutilizables por RangeCard.
function crearLecturasDesdeValores(valores, idealMin, decimals) {
  return (Array.isArray(valores) ? valores : []).map((value, index) =>
    crearLectura(index + 1, Number(value) || idealMin, decimals),
  );
}

export default function useRangeCard({
  idealMin,
  idealMax,
  sliderMin,
  sliderMax,
  step,
  decimals,
  maxLecturas,
  onChange,
  initialValues = [],
}) {
  const initialLecturas = Array.isArray(initialValues) ? initialValues : [];

  const [lecturas, setLecturas] = useState(() => {
    if (initialLecturas.length > 0) {
      return crearLecturasDesdeValores(initialLecturas, idealMin, decimals);
    }

    // Start empty by default (no measurement created until user adds one
    // or initialValues are provided).
    return [];
  });

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Auxiliar para saber si los valores numéricos de initialValues coinciden
  // exactamente con lo que ya tenemos cargado en lecturas localmente.
  // Evita el bucle de actualización "Maximum update depth exceeded".
  const sonValoresIguales = (valoresIniciales, lecturasActuales) => {
    const arr = Array.isArray(valoresIniciales) ? valoresIniciales : [];
    if (arr.length !== lecturasActuales.length) return false;
    for (let i = 0; i < arr.length; i++) {
      if (Number(arr[i]) !== Number(lecturasActuales[i]?.value)) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const arr = Array.isArray(initialValues) ? initialValues : [];

    // Si los valores que vienen del padre son idénticos a los que ya tenemos
    // (por ejemplo porque fuimos nosotros mismos los que notificamos onChange),
    // NO llamamos a setLecturas para romper el bucle infinito.
    if (sonValoresIguales(arr, lecturas)) {
      return;
    }

    const next = arr.length > 0
      ? crearLecturasDesdeValores(arr, idealMin, decimals)
      : [];

    setLecturas(next);
  }, [JSON.stringify(initialValues), idealMin, decimals]);

  // Ref para evitar que el montaje inicial emita onChange([]) antes de
  // que los initialValues se apliquen (race condition cuando el key del
  // RangeCard cambia y el componente se remonta con datos vacíos
  // transitorios mientras el fetch de mediciones está en vuelo).
  const mountedRef = useRef(false);
  const lastEmittedRef = useRef('');

  // Única fuente que notifica al padre: se dispara después del render
  useEffect(() => {
    const serialized = JSON.stringify(lecturas.map((r) => r.value));
    if (serialized === lastEmittedRef.current) {
      return;
    }
    lastEmittedRef.current = serialized;

    if (!mountedRef.current) {
      mountedRef.current = true;
      // En el primer render, solo emitir si ya hay lecturas reales.
      // Si está vacío, no notificar — evita borrar los datos del padre.
      if (lecturas.length > 0) {
        onChangeRef.current?.(lecturas);
      }
      return;
    }
    onChangeRef.current?.(lecturas);
  }, [lecturas]);

  const actualizarLectura = useCallback(
    (id, patch) => {
      setLecturas((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    },
    []
  );

  const agregarLectura = useCallback(() => {
    if (lecturas.length >= maxLecturas) return;
    setLecturas((prev) => [...prev, crearLectura(Date.now(), idealMin, decimals)]);
  }, [lecturas.length, maxLecturas, idealMin, decimals]);

  const eliminarLectura = useCallback((id) => {
    setLecturas((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const decrementar = useCallback(
    (id) => {
      setLecturas((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const next = parseFloat(limitar(r.value - step, sliderMin, sliderMax).toFixed(decimals));
          return { ...r, value: next, rawInput: formatear(next, decimals) };
        })
      );
    },
    [step, sliderMin, sliderMax, decimals]
  );

  const incrementar = useCallback(
    (id) => {
      setLecturas((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const next = parseFloat(limitar(r.value + step, sliderMin, sliderMax).toFixed(decimals));
          return { ...r, value: next, rawInput: formatear(next, decimals) };
        })
      );
    },
    [step, sliderMin, sliderMax, decimals]
  );

  const normalizar = (v) => (v - sliderMin) / (sliderMax - sliderMin);
  const tieneMaxIdeal = Number.isFinite(idealMax);

  // Devuelve los manejadores de una lectura puntual (botones +/-, input, blur)
  const obtenerManejadores = useCallback(
    (r) => ({
      decrementar: () => decrementar(r.id),
      incrementar: () => incrementar(r.id),
      handleChangeText: (text) => {
        const cleaned = text.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        const integer = parts[0].slice(0, 2);
        const result = parts.length > 1 ? `${integer}.${parts[1]}` : integer;
        const parsed = parseFloat(result);
        if (!isNaN(parsed)) {
          const clamped = parseFloat(limitar(parsed, sliderMin, sliderMax).toFixed(decimals));
          actualizarLectura(r.id, { rawInput: result, value: clamped });
        } else {
          actualizarLectura(r.id, { rawInput: result });
        }
      },
      handleFocus: () => actualizarLectura(r.id, { editing: true, rawInput: formatear(r.value, decimals) }),
      handleBlur: () => {
        const parsed = parseFloat(r.rawInput);
        const safe = isNaN(parsed)
          ? r.value
          : parseFloat(limitar(parsed, sliderMin, sliderMax).toFixed(decimals));
        actualizarLectura(r.id, { value: safe, rawInput: formatear(safe, decimals), editing: false });
      },
      // Actualiza el valor mientras se arrastra el thumb de RangeTrack.
      // El valor ya llega redondeado/clampeado desde el componente.
      handleArrastre: (nuevoValor) => {
        const next = parseFloat(limitar(nuevoValor, sliderMin, sliderMax).toFixed(decimals));
        actualizarLectura(r.id, { value: next, rawInput: formatear(next, decimals) });
      },
    }),
    [decrementar, incrementar, sliderMin, sliderMax, decimals, actualizarLectura]
  );

  return {
    lecturas,
    agregarLectura,
    eliminarLectura,
    normalizar,
    tieneMaxIdeal,
    obtenerManejadores,
  };
}