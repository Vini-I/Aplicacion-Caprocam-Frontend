import { useCallback, useState } from 'react';

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const fmt   = (val, decimals) => val.toFixed(decimals);

function makeReading(id, value, decimals) {
  return { id, value, rawInput: fmt(value, decimals), editing: false };
}

/**
 * ============================================================
 * HOOK useRangeCard
 * ============================================================
 *
 * Maneja el estado de las lecturas de RangeCard: agregar/quitar
 * lecturas, clamping de valores dentro de sliderMin/sliderMax,
 * formateo de decimales y cálculo del progreso global.
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
 * maxReadings  number  — tope de lecturas
 * onChange     fn?     — (readings) => void, callback hacia el padre
 *
 * ---
 * RETORNA
 * ---
 * readings            array  — [{ id, value, rawInput, editing }]
 * addReading          fn     — agrega una lectura nueva (respeta maxReadings)
 * removeReading       fn(id) — elimina una lectura (nunca deja el array vacío)
 * normalize           fn(v)  — convierte un valor a 0–1 según sliderMin/sliderMax
 * hasUpperIdeal       bool   — true si se definió idealMax
 * globalProgress      number — promedio de todas las lecturas, normalizado 0–1
 * allOk               bool   — true si todas las lecturas están en rango ideal
 * getReadingHandlers  fn(r)  — dado un objeto de lectura, retorna
 *                              { decrement, increment, handleChangeText, handleFocus, handleBlur }
 *
 * ---
 * EJEMPLO DE USO
 * ---
 * const {
 *   readings, addReading, removeReading,
 *   normalize, hasUpperIdeal, globalProgress, allOk,
 *   getReadingHandlers,
 * } = useRangeCard({
 *   idealMin: 7.5, idealMax: 8.5,
 *   sliderMin: 4, sliderMax: 10,
 *   step: 0.1, decimals: 1, maxReadings: 2,
 *   onChange: (r) => setPhReadings(r),
 * });
 *
 * const { increment, decrement, handleChangeText, handleBlur } = getReadingHandlers(readings[0]);
 */

export default function useRangeCard({
  idealMin,
  idealMax,
  sliderMin,
  sliderMax,
  step,
  decimals,
  maxReadings,
  onChange,
}) {
  const [readings, setReadings] = useState([
    makeReading(1, idealMin, decimals),
  ]);

  const updateReading = useCallback(
    (id, patch) => {
      setReadings((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

  const addReading = useCallback(() => {
    if (readings.length >= maxReadings) return;
    setReadings((prev) => {
      const next = [...prev, makeReading(Date.now(), idealMin, decimals)];
      onChange?.(next);
      return next;
    });
  }, [readings.length, maxReadings, idealMin, decimals, onChange]);

  const removeReading = useCallback((id) => {
    setReadings((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((r) => r.id !== id);
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  const normalize     = (v) => (v - sliderMin) / (sliderMax - sliderMin);
  const hasUpperIdeal = Number.isFinite(idealMax);

  const avg = readings.reduce((s, r) => s + r.value, 0) / readings.length;
  const allOk = readings.every((r) =>
    hasUpperIdeal ? r.value >= idealMin && r.value <= idealMax : r.value >= idealMin
  );
  const globalProgress = clamp(normalize(avg), 0, 1);

  // Devuelve los 4 handlers de una lectura puntual (botones +/-, input, blur)
  const getReadingHandlers = useCallback(
    (r) => ({
      decrement: () => {
        const next = parseFloat(clamp(r.value - step, sliderMin, sliderMax).toFixed(decimals));
        updateReading(r.id, { value: next, rawInput: fmt(next, decimals) });
      },
      increment: () => {
        const next = parseFloat(clamp(r.value + step, sliderMin, sliderMax).toFixed(decimals));
        updateReading(r.id, { value: next, rawInput: fmt(next, decimals) });
      },
      handleChangeText: (text) => {
        const cleaned = text.replace(/[^0-9.]/g, '');
        const parts   = cleaned.split('.');
        const integer = parts[0].slice(0, 2);
        const result  = parts.length > 1 ? `${integer}.${parts[1]}` : integer;
        const parsed  = parseFloat(result);
        if (!isNaN(parsed)) {
          const clamped = parseFloat(clamp(parsed, sliderMin, sliderMax).toFixed(decimals));
          updateReading(r.id, { rawInput: result, value: clamped });
        } else {
          updateReading(r.id, { rawInput: result });
        }
      },
      handleFocus: () => updateReading(r.id, { editing: true, rawInput: fmt(r.value, decimals) }),
      handleBlur: () => {
        const parsed = parseFloat(r.rawInput);
        const safe   = isNaN(parsed)
          ? r.value
          : parseFloat(clamp(parsed, sliderMin, sliderMax).toFixed(decimals));
        updateReading(r.id, { value: safe, rawInput: fmt(safe, decimals), editing: false });
      },
    }),
    [step, sliderMin, sliderMax, decimals, updateReading]
  );

  return {
    readings,
    addReading,
    removeReading,
    normalize,
    hasUpperIdeal,
    globalProgress,
    allOk,
    getReadingHandlers,
  };
}