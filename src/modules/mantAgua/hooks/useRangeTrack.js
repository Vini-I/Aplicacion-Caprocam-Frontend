/**
 * ============================================================
 * HOOK useRangeTrack
 * ============================================================
 *
 * Descripción:
 * Administra los gestos PanResponder para el slider continuo de RangeTrack.
 *
 * @dependencies PanResponder, useRef (react-native, react)
 * @validations Limita los valores arrastrados entre min y max con decimales configurables.
 * @navigation N/A
 */
import { useRef } from 'react';
import { PanResponder } from 'react-native';

export default function useRangeTrack({ value, min, max, decimals, onChange }) {
  const widthRef = useRef(0);
  const valueRef = useRef(value);
  const startValueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  valueRef.current = value;
  onChangeRef.current = onChange;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startValueRef.current = valueRef.current;
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (widthRef.current <= 0) return;
        const rango = max - min;
        const deltaValor = (gestureState.dx / widthRef.current) * rango;
        let siguiente = startValueRef.current + deltaValor;
        siguiente = Math.min(Math.max(siguiente, min), max);
        siguiente = parseFloat(siguiente.toFixed(decimals));
        onChangeRef.current?.(siguiente);
      },
    })
  ).current;

  return {
    widthRef,
    panResponder,
  };
}
