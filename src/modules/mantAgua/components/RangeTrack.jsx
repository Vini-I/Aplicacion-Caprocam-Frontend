/**
 * ============================================================
 * COMPONENTE RangeTrack
 * ============================================================
 *
 * Descripción:
 * Componente presentacional para barra de rango dinámica con slider
 * interactivo (PanResponder), zonas de indicación visual y alineación
 * dinámica de etiquetas de ticks (mínimo alineado a la derecha debajo de la barra).
 *
 * @dependencies RangeTrackStyles, COLORS, Text
 * @validations Restringe valores al rango min-max y aplica formato decimal.
 * @navigation N/A
 */

import { useRef } from 'react';
import { View, PanResponder } from 'react-native';
import Text from '../../../shared/components/Text';
import { COLORS } from '../../../theme/colors';
import { styles } from '../styles/RangeTrackStyles';

export default function RangeTrack({
  value,
  min,
  max,
  decimals = 1,
  zones = [],
  ticks = [],
  badgeColor = COLORS.primary,
  badgeText,
  onChange,
}) {
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

  const pct = Math.min(Math.max((value - min) / (max - min || 1), 0), 1);

  return (
    <View style={styles.container}>
      <View
        style={styles.trackWrapper}
        onLayout={(e) => {
          widthRef.current = e.nativeEvent.layout.width;
        }}
      >
        <View style={styles.trackBackground}>
          {zones.map((z, i) => (
            <View
              key={i}
              style={[
                styles.zoneSegment,
                {
                  left: `${z.left * 100}%`,
                  width: `${z.width * 100}%`,
                  backgroundColor: z.color,
                },
              ]}
            />
          ))}
        </View>

        <View pointerEvents="none" style={[styles.badgeContainer, { left: `${pct * 100}%` }]}>
          <View style={[styles.badgeBox, { backgroundColor: badgeColor }]}>
            <Text size={12} color={COLORS.white} weight="700">{badgeText}</Text>
          </View>
          <View style={[styles.badgePointer, { borderTopColor: badgeColor }]} />
        </View>

        <View
          {...panResponder.panHandlers}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={[styles.thumb, { left: `${pct * 100}%`, borderColor: badgeColor }]}
        />
      </View>

      <View style={styles.ticksContainer}>
        {ticks.map((t, i) => {
          let translateX = '-50%';
          if (t.pct === 0) translateX = '0%';
          else if (t.pct === 1) translateX = '-100%';

          return (
            <Text
              key={i}
              size={10}
              color={COLORS.textQuaternary}
              style={[
                styles.tickText,
                { left: `${t.pct * 100}%`, transform: [{ translateX }] },
              ]}
            >
              {t.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}