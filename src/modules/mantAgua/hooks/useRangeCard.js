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
import { getCurrentTime12 } from '../../../shared/utils/dateUtils';

const limitar = (val, min, max) => Math.min(Math.max(val, min), max);
const formatear = (val, decimals) => val.toFixed(decimals);

function crearLectura(id, value, decimals, horaMedicion) {
  return {
    id,
    value,
    rawInput: formatear(value, decimals),
    editing: false,
    horaMedicion: horaMedicion || getCurrentTime12(),
  };
}

// Convierte valores iniciales en objetos de lectura reutilizables por RangeCard.
function crearLecturasDesdeValores(valores, idealMin, decimals) {
  return (Array.isArray(valores) ? valores : []).map((item, index) => {
    if (typeof item === 'object' && item !== null) {
      return crearLectura(
        item.id || index + 1,
        Number(item.value ?? item.valor) || idealMin,
        decimals,
        item.horaMedicion || item.hora_medicion
      );
    }
    return crearLectura(index + 1, Number(item) || idealMin, decimals);
  });
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
    return [];
  });

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const sonValoresIguales = (valoresIniciales, lecturasActuales) => {
    const arr = Array.isArray(valoresIniciales) ? valoresIniciales : [];
    if (arr.length !== lecturasActuales.length) return false;
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      const val = typeof item === 'object' && item !== null ? item.value ?? item.valor : item;
      const hora = typeof item === 'object' && item !== null ? item.horaMedicion ?? item.hora_medicion : undefined;
      if (Number(val) !== Number(lecturasActuales[i]?.value)) {
        return false;
      }
      if (hora && hora !== lecturasActuales[i]?.horaMedicion) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const arr = Array.isArray(initialValues) ? initialValues : [];

    if (sonValoresIguales(arr, lecturas)) {
      return;
    }

    const next = arr.length > 0
      ? crearLecturasDesdeValores(arr, idealMin, decimals)
      : [];

    setLecturas(next);
  }, [JSON.stringify(initialValues), idealMin, decimals]);

  const mountedRef = useRef(false);
  const lastEmittedRef = useRef('');

  useEffect(() => {
    const serialized = JSON.stringify(
      lecturas.map((r) => ({ value: r.value, horaMedicion: r.horaMedicion }))
    );
    if (serialized === lastEmittedRef.current) {
      return;
    }
    lastEmittedRef.current = serialized;

    if (!mountedRef.current) {
      mountedRef.current = true;
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

  const actualizaHora = useCallback((id, horaMedicion) => {
    setLecturas((prev) => prev.map((r) => (r.id === id ? { ...r, horaMedicion } : r)));
  }, []);

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

  const obtenerManejadores = useCallback(
    (r) => ({
      decrementar: () => decrementar(r.id),
      incrementar: () => incrementar(r.id),
      actualizaHora: (hora12) => actualizaHora(r.id, hora12),
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
      handleArrastre: (nuevoValor) => {
        const next = parseFloat(limitar(nuevoValor, sliderMin, sliderMax).toFixed(decimals));
        actualizarLectura(r.id, { value: next, rawInput: formatear(next, decimals) });
      },
    }),
    [decrementar, incrementar, actualizaHora, sliderMin, sliderMax, decimals, actualizarLectura]
  );

  return {
    lecturas,
    agregarLectura,
    eliminarLectura,
    actualizaHora,
    normalizar,
    tieneMaxIdeal,
    obtenerManejadores,
  };
}