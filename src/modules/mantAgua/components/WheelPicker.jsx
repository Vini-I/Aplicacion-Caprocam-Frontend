/**
 * ============================================================
 * COMPONENTE WHEELPICKER
 * ============================================================
 *
 * Este componente se utiliza para mostrar un selector numerico
 * tipo ruleta con scroll y ajuste automatico al valor mas cercano.
 *
 * Permite:
 * - Seleccionar un valor desde una lista ordenada
 * - Resaltar el valor activo en tiempo real
 * - Hacer snap al soltar el scroll o el gesto
 * - Funcionar en web y en dispositivos moviles
 *
 * ---
 * PARAMETROS
 * ---
 *
 * values
 * Lista de valores disponibles para seleccionar.
 *
 * value
 * Valor actualmente seleccionado.
 *
 * onChange
 * Funcion que recibe el valor confirmado por el usuario.
 *
 * unit
 * Unidad o sufijo que acompana cada valor.
 *
 * color
 * Color del valor resaltado y de la linea indicadora.
 *
 * textHint
 * Color de los valores no seleccionados.
 *
 * ============================================================
 * EJEMPLOS RAPIDOS
 * ============================================================
 *
 * <WheelPicker
 *   values={[1, 2, 3, 4, 5]}
 *   value={3}
 *   onChange={setValor}
 *   unit="cm"
 *   color="#009EF5"
 *   textHint="#94A3B8"
 * />
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import Text from '../../../shared/components/Text';

const IS_WEB = typeof Platform !== 'undefined'
  ? Platform.OS === 'web'
  : typeof document !== 'undefined';

const ITEM_HEIGHT   = 44;
const VISIBLE_ITEMS = 5;

export default function WheelPicker({
  values       = [],
  value,
  onChange,
  unit         = '',
  itemHeight   = ITEM_HEIGHT,
  visibleItems = VISIBLE_ITEMS,
  color        = '#009EF5',
  textHint     = '#94A3B8',
}) {
  const scrollRef       = useRef(null);
  const containerHeight = itemHeight * visibleItems;
  const padding         = itemHeight * Math.floor(visibleItems / 2);
  const initialIndex    = Math.max(0, values.indexOf(value));

  // Índice resaltado en tiempo real (no espera a onChange)
  const [highlightIndex, setHighlightIndex] = useState(initialIndex);

  // Sincroniza si el padre cambia `value` desde afuera
  useEffect(() => {
    const idx = values.indexOf(value);
    if (idx >= 0) setHighlightIndex(idx);
  }, [value, values]);

  // Centra el valor inicial al montar
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: initialIndex * itemHeight,
        animated: false,
      });
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Calcula índice desde offset y actualiza highlight ──────
  const indexFromOffset = useCallback(
    (offsetY) => {
      const raw     = offsetY / itemHeight;
      const clamped = Math.max(0, Math.min(Math.round(raw), values.length - 1));
      return clamped;
    },
    [itemHeight, values.length]
  );

  // Actualiza highlight en tiempo real mientras scrollea
  const handleScroll = useCallback(
    (e) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const idx     = indexFromOffset(offsetY);
      setHighlightIndex(idx);
    },
    [indexFromOffset]
  );

  // Snap + commit al terminar (con o sin momentum)
  const snapAndCommit = useCallback(
    (offsetY) => {
      const idx      = indexFromOffset(offsetY);
      const snappedY = idx * itemHeight;
      scrollRef.current?.scrollTo({ y: snappedY, animated: true });
      setHighlightIndex(idx);
      if (values[idx] !== value) {
        onChange?.(values[idx]);
      }
    },
    [indexFromOffset, itemHeight, values, value, onChange]
  );

  const handleMomentumEnd = useCallback(
    (e) => snapAndCommit(e.nativeEvent.contentOffset.y),
    [snapAndCommit]
  );

  const handleScrollEndDrag = useCallback(
    (e) => {
      const velocity = e.nativeEvent.velocity?.y ?? 0;
      if (Math.abs(velocity) < 0.2) {
        snapAndCommit(e.nativeEvent.contentOffset.y);
      }
    },
    [snapAndCommit]
  );

  // ── Web: wheel del mouse ────────────────────────────────────
  const webOffsetRef  = useRef(initialIndex * itemHeight);
  const wheelTimerRef = useRef(null);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      webOffsetRef.current = Math.max(
        0,
        Math.min(
          webOffsetRef.current + e.deltaY * 0.6,
          (values.length - 1) * itemHeight
        )
      );
      // Actualiza highlight inmediatamente
      const idx = indexFromOffset(webOffsetRef.current);
      setHighlightIndex(idx);
      scrollRef.current?.scrollTo({ y: webOffsetRef.current, animated: false });

      // Snap suave al soltar
      clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        snapAndCommit(webOffsetRef.current);
        webOffsetRef.current = idx * itemHeight;
      }, 120);
    },
    [values.length, itemHeight, indexFromOffset, snapAndCommit]
  );

  // ── Web: drag del mouse ─────────────────────────────────────
  const dragRef      = useRef({ active: false, startY: 0, startOffset: 0 });
  const dragTimerRef = useRef(null);

  const handleMouseDown = useCallback(
    (e) => {
      dragRef.current = {
        active:      true,
        startY:      e.clientY,
        startOffset: webOffsetRef.current,
      };
    },
    []
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragRef.current.active) return;
      const delta  = dragRef.current.startY - e.clientY;
      const newOff = Math.max(
        0,
        Math.min(
          dragRef.current.startOffset + delta,
          (values.length - 1) * itemHeight
        )
      );
      webOffsetRef.current = newOff;
      const idx = indexFromOffset(newOff);
      setHighlightIndex(idx);
      scrollRef.current?.scrollTo({ y: newOff, animated: false });
    },
    [values.length, itemHeight, indexFromOffset]
  );

  const handleMouseUp = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    clearTimeout(dragTimerRef.current);
    dragTimerRef.current = setTimeout(() => {
      snapAndCommit(webOffsetRef.current);
      webOffsetRef.current = indexFromOffset(webOffsetRef.current) * itemHeight;
    }, 80);
  }, [snapAndCommit, indexFromOffset, itemHeight]);

  // Adjunta listeners de mouse globales en web
  useEffect(() => {
    if (!IS_WEB) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup',   handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup',   handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // ── Render ──────────────────────────────────────────────────
  const scrollViewProps =
    IS_WEB
      ? { onWheel: handleWheel, onMouseDown: handleMouseDown }
      : {};

  return (
    <View style={[s.container, { height: containerHeight }]}>
      {/* Líneas de selección */}
      <View
        pointerEvents="none"
        style={[
          s.selector,
          {
            top:               padding,
            height:            itemHeight,
            borderTopColor:    color,
            borderBottomColor: color,
          },
        ]}
      />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={8}
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollEndDrag={handleScrollEndDrag}
        contentContainerStyle={{ paddingVertical: padding }}
        {...scrollViewProps}
      >
        {values.map((v, i) => {
          const isSelected = i === highlightIndex;
          return (
            <View key={i} style={[s.item, { height: itemHeight }]}>
              <Text
                tamano={isSelected ? 'lg' : 'sm'}
                color={isSelected ? color : textHint}
                estilo={[
                  s.itemText,
                  {
                    fontWeight: isSelected ? '700' : '400',
                    opacity: isSelected ? 1 : 0.5,
                  },
                ]}
              >
                {v}{unit ? ` ${unit}` : ''}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  selector: {
    position:          'absolute',
    left:              0,
    right:             0,
    borderTopWidth:    1.5,
    borderBottomWidth: 1.5,
    zIndex:            1,
    pointerEvents:     'none',
  },
  item: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  itemText: {
    textAlign: 'center',
  },
});
