/**
 * ============================================================
 * HOOK useRangeCard
 * ============================================================
 *
 * Maneja el estado de las lecturas de RangeCard: agregar/quitar
 * lecturas, clamping de valores dentro de sliderMin/sliderMax y
 * formateo de decimales.
 * Admite iniciar vacío y permite eliminar lecturas hasta quedar en cero.
 *
 * ---
 * PARÁMETROS (objeto único)
 * ---
 * idealMin     number  — límite inferior del rango ideal
 * idealMax     number? — límite superior del rango ideal
 * sliderMin    number  — límite inferior permitido al editar
 * sliderMax    number  — límite superior permitido al editar
 * step         number  — incremento de los botones +/-
 * decimals     number  — decimales a redondear
 * maxLecturas  number  — tope de lecturas
 * onChange     fn?     — (lecturas) => void, callback hacia el padre
 *
 * ---
 * RETORNA
 * ---
 * lecturas            array  — [{ id, value, rawInput, editing }]
 * agregarLectura      fn     — agrega una lectura nueva (respeta maxLecturas)
 * eliminarLectura     fn(id) — elimina una lectura (nunca deja el array vacío)
 * normalizar          fn(v)  — convierte un valor a 0–1 según sliderMin/sliderMax
 * tieneMaxIdeal       bool   — true si se definió idealMax
 * obtenerManejadores  fn(r)  — dado un objeto de lectura, retorna
 *                              { decrementar, incrementar, handleChangeText, handleFocus, handleBlur, handleArrastre }
 *
 * ---
 * RESTRICCIONES
 * ---
 * - No hacer llamadas a servicios/API desde este hook; solo maneja estado local.
 * - Nunca dejar el arreglo de lecturas vacío; respetar siempre maxLecturas.
 *
 * ---
 * EJEMPLO DE USO
 * ---
 * const {
 *   lecturas, agregarLectura, eliminarLectura,
 *   normalizar, tieneMaxIdeal,
 *   obtenerManejadores,
 * } = useRangeCard({
 *   idealMin: 7.5, idealMax: 8.5,
 *   sliderMin: 4, sliderMax: 10,
 *   step: 0.1, decimals: 1, maxLecturas: 2,
 *   onChange: (r) => setLecturasPh(r),
 * });
 *
 * const { incrementar, decrementar, handleChangeText, handleBlur } = obtenerManejadores(lecturas[0]);
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

  useEffect(() => {
    const next = initialLecturas.length > 0
      ? crearLecturasDesdeValores(initialLecturas, idealMin, decimals)
      : [];

    setLecturas(next);
  }, [JSON.stringify(initialLecturas), idealMin, decimals]);

  // Ref para evitar que el montaje inicial emita onChange([]) antes de
  // que los initialValues se apliquen (race condition cuando el key del
  // RangeCard cambia y el componente se remonta con datos vacíos
  // transitorios mientras el fetch de mediciones está en vuelo).
  const mountedRef = useRef(false);

  // Única fuente que notifica al padre: se dispara después del render
  // (nunca dentro de un reducer de setState), así el drag continuo no
  // intenta actualizar FisicoQuimicaScreen mientras RangeCard se está
  // renderizando.
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      // En el primer render, solo emitir si ya hay lecturas reales.
      // Si está vacío, no notificar — evita borrar los datos del padre.
      if (lecturas.length > 0) {
        onChange?.(lecturas);
      }
      return;
    }
    onChange?.(lecturas);
  }, [lecturas, onChange]);

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

  const normalizar = (v) => (v - sliderMin) / (sliderMax - sliderMin);
  const tieneMaxIdeal = Number.isFinite(idealMax);

  // Devuelve los manejadores de una lectura puntual (botones +/-, input, blur)
  const obtenerManejadores = useCallback(
    (r) => ({
      decrementar: () => {
        const next = parseFloat(limitar(r.value - step, sliderMin, sliderMax).toFixed(decimals));
        actualizarLectura(r.id, { value: next, rawInput: formatear(next, decimals) });
      },
      incrementar: () => {
        const next = parseFloat(limitar(r.value + step, sliderMin, sliderMax).toFixed(decimals));
        actualizarLectura(r.id, { value: next, rawInput: formatear(next, decimals) });
      },
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
    [step, sliderMin, sliderMax, decimals, actualizarLectura]
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