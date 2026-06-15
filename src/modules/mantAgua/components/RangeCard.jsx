/**
 * ============================================================
 * COMPONENTE RANGECARD
 * ============================================================
 *
 * Este componente se utiliza para mostrar una tarjeta de
 * mediciones numericas con controles de incremento, decremento
 * y entrada manual del valor.
 *
 * Permite:
 * - Mostrar una etiqueta y una unidad de medida
 * - Registrar una o varias mediciones
 * - Marcar si el valor esta dentro del rango ideal
 * - Mostrar una barra de progreso global y una barra por lectura
 * - Trabajar con un rango ideal completo o con un minimo unico
 *
 * ---
 * PARAMETROS
 * ---
 *
 * title
 * Texto del encabezado de la tarjeta.
 *
 * unit
 * Unidad de medida que acompana el valor.
 *
 * icon
 * Componente <Icon /> ya instanciado como JSX element.
 * Ejemplo: icon={<Icon icon={ICONS.temperature} color={COLORS.primary} size={18} />}
 *
 * idealMin / idealMax
 * Define el rango ideal. Si idealMax no se envia, el
 * componente funciona como minimo recomendado.
 *
 * sliderMin / sliderMax
 * Limites permitidos para la medicion.
 *
 * step
 * Incremento o decremento aplicado por los botones.
 *
 * maxReadings
 * Cantidad maxima de mediciones permitidas.
 *
 * labelStyle
 * Define el tipo de etiqueta para cada medicion.
 * Valores posibles: "numeric" | "daynight"
 *
 * onChange
 * Funcion que recibe el arreglo actualizado de mediciones.
 *
 * ============================================================
 * EJEMPLOS RAPIDOS
 * ============================================================
 *
 * <RangeCard
 *   title="pH"
 *   unit="pH"
 *   icon={<Icon icon={ICONS.chemicalContainer} color={COLORS.primary} size={18} />}
 *   idealMin={7.5}
 *   idealMax={8.5}
 *   sliderMin={4}
 *   sliderMax={10}
 * />
 *
 * <RangeCard
 *   title="Oxigeno Disuelto"
 *   unit="mg/L"
 *   icon={<Icon icon={ICONS.water} color={COLORS.primary} size={18} />}
 *   idealMin={5}
 *   sliderMin={0}
 *   sliderMax={20}
 * />
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import ProgressBar from '../../../shared/components/ProgressBar';
import Button      from '../../../shared/components/Button';
import Text        from '../../../shared/components/Text';
import Title       from '../../../shared/components/Title';
import Icon        from '../../../shared/components/Icons';
import { COLORS }  from '../../../theme/colors';
import { ICONS }   from '../../../theme/icons';

// ── Etiquetas para hasta 5 mediciones ────────────────────────
const LABELS_DAYNIGHT = [
  { type: 'icon', icon: ICONS.morningSun },
  { type: 'icon', icon: ICONS.nightSun },
];
const LABELS_NUMERIC = [
  { type: 'text', value: '①' },
  { type: 'text', value: '②' },
  { type: 'text', value: '③' },
  { type: 'text', value: '④' },
  { type: 'text', value: '⑤' },
];

// ── Helpers ──────────────────────────────────────────────────
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const fmt   = (val, decimals) => val.toFixed(decimals);

function makeReading(id, value, decimals) {
  return { id, value, rawInput: fmt(value, decimals), editing: false };
}

// ── Componente ───────────────────────────────────────────────
export default function RangeCard({
  title,
  unit,
  icon,                   // JSX element: <Icon icon={ICONS.x} color={...} size={18} />
  idealMin,
  idealMax,
  sliderMin,
  sliderMax,
  step          = 0.1,
  decimals      = 1,
  maxReadings   = 4,
  showProgress  = true,
  showRangeColor = true,
  labelStyle    = 'numeric',
  badgeLabel,
  onChange,
}) {
  const [readings, setReadings] = useState([
    makeReading(1, idealMin, decimals),
  ]);

  const updateReading = useCallback(
    (id, patch) => {
      setReadings((prev) => {
        const next = prev.map((r) => r.id === id ? { ...r, ...patch } : r);
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

  const addReading = () => {
    if (readings.length >= maxReadings) return;
    setReadings((prev) => {
      const next = [...prev, makeReading(Date.now(), idealMin, decimals)];
      onChange?.(next);
      return next;
    });
  };

  const removeReading = (id) => {
    if (readings.length <= 1) return;
    setReadings((prev) => {
      const next = prev.filter((r) => r.id !== id);
      onChange?.(next);
      return next;
    });
  };

  const normalize      = (v) => (v - sliderMin) / (sliderMax - sliderMin);
  const hasUpperIdeal  = Number.isFinite(idealMax);

  const avg           = readings.reduce((s, r) => s + r.value, 0) / readings.length;
  const allOk         = readings.every((r) =>
    hasUpperIdeal ? r.value >= idealMin && r.value <= idealMax : r.value >= idealMin
  );
  const globalProgress = Math.min(Math.max(normalize(avg), 0), 1);
  const barColor       = allOk ? COLORS.success : globalProgress > 0 ? COLORS.warning : '#e2e8f0';

  const markerLeft  = `${normalize(idealMin) * 100}%`;
  const markerRight = hasUpperIdeal ? `${normalize(idealMax) * 100}%` : null;

  const LABELS = labelStyle === 'daynight' ? LABELS_DAYNIGHT : LABELS_NUMERIC;

  const resolvedBadge = badgeLabel ?? (
    hasUpperIdeal
      ? `Ideal: ${idealMin}–${idealMax} ${unit}`
      : `Min ${idealMin} ${unit}`
  );

  return (
    <View style={s.card}>

      {/* ── Header ── */}
      <View style={s.cardHeader}>
        <View style={s.cardHeaderLeft}>
          {/* icon es un JSX element ya construido — se renderiza directo */}
          {icon}
          <Title level={5} color={COLORS.textPrimary}>
            {title}
          </Title>
          <Text size={13} color={COLORS.textTertiary}>
            ({unit})
          </Text>
        </View>
        <Text size={12} color={COLORS.primary}>
          {resolvedBadge}
        </Text>
      </View>

      {/* ── Progress bar global (opcional) ── */}
      {showProgress && (
        <View style={{ marginBottom: 14 }}>
          <ProgressBar
            showLabel={false}
            progress={Math.round(globalProgress * 100)}
            color={barColor}
          />
          <View style={{ position: 'relative', height: 12 }}>
            <View style={[inner.idealMarker, { left: markerLeft }]} />
            {markerRight && <View style={[inner.idealMarker, { left: markerRight }]} />}
          </View>
        </View>
      )}

      {/* ── Mediciones ── */}
      {readings.map((r, idx) => {
        const inRange    = r.value >= idealMin && r.value <= idealMax;
        const inMinRange = r.value >= idealMin;
        const showGreen  = showRangeColor && (hasUpperIdeal ? inRange : inMinRange);
        const readingProgress = Math.min(Math.max(normalize(r.value), 0), 1);
        const miniBarColor    = showGreen ? COLORS.success : COLORS.primary;

        const decrement = () => {
          const next = parseFloat(clamp(r.value - step, sliderMin, sliderMax).toFixed(decimals));
          updateReading(r.id, { value: next, rawInput: fmt(next, decimals) });
        };

        const increment = () => {
          const next = parseFloat(clamp(r.value + step, sliderMin, sliderMax).toFixed(decimals));
          updateReading(r.id, { value: next, rawInput: fmt(next, decimals) });
        };

        const handleChangeText = (text) => {
          const cleaned = text.replace(/[^0-9.]/g, '');
          const parts   = cleaned.split('.');
          const integer = parts[0].slice(0, 2);
          const result  = parts.length > 1 ? `${integer}.${parts[1]}` : integer;
          updateReading(r.id, { rawInput: result });
          const parsed = parseFloat(result);
          if (!isNaN(parsed)) {
            const clamped = parseFloat(clamp(parsed, sliderMin, sliderMax).toFixed(decimals));
            updateReading(r.id, { rawInput: result, value: clamped });
          }
        };

        const handleBlur = () => {
          const parsed = parseFloat(r.rawInput);
          const safe   = isNaN(parsed)
            ? r.value
            : parseFloat(clamp(parsed, sliderMin, sliderMax).toFixed(decimals));
          updateReading(r.id, { value: safe, rawInput: fmt(safe, decimals), editing: false });
        };

        return (
          <View key={r.id} style={inner.readingRow}>

            {/* Etiqueta día/noche o ①②③ */}
            {(() => {
              const lbl = LABELS[idx] ?? { type: 'text', value: `${idx + 1}` };
              return lbl.type === 'icon' ? (
                <Icon icon={lbl.icon} size={18} color={COLORS.primary} />
              ) : (
                <Text size={13} color={COLORS.textQuaternary} style={{ width: 22, textAlign: 'center' }}>
                  {lbl.value}
                </Text>
              );
            })()}

            {/* Botón − */}
            <Pressable
              onPress={decrement}
              style={({ pressed }) => [inner.stepBtn, { backgroundColor: pressed ? '#e2e8f0' : '#f1f5f9' }]}
              hitSlop={8}
            >
              <Text size={20} color={COLORS.primary} style={{ lineHeight: 26 }}>−</Text>
            </Pressable>

            {/* Valor + mini barra */}
            <View style={{ flex: 1 }}>
              <View style={inner.valueRow}>
                <TextInput
                  value={r.editing ? r.rawInput : fmt(r.value, decimals)}
                  onChangeText={handleChangeText}
                  onFocus={() => updateReading(r.id, { editing: true, rawInput: fmt(r.value, decimals) })}
                  onBlur={handleBlur}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                  style={[
                    inner.valueInput,
                    {
                      color:            showGreen ? COLORS.success : COLORS.primary,
                      borderBottomColor: COLORS.primary,
                      borderBottomWidth: r.editing ? 1.5 : 0,
                    },
                  ]}
                />
                <Text size={13} color={COLORS.textQuaternary} style={{ marginLeft: 3, fontWeight: '600' }}>
                  {unit}
                </Text>
                {showGreen && !r.editing && (
                  <Icon icon={ICONS.check} size={15} color={COLORS.success} style={{ marginLeft: 4 }} />
                )}
              </View>

              <ProgressBar
                showLabel= {false}
                progress={Math.round(readingProgress * 100)}
                color={miniBarColor}

              />
            </View>

            {/* Botón + */}
            <Pressable
              onPress={increment}
              style={({ pressed }) => [inner.stepBtn, { backgroundColor: pressed ? '#e2e8f0' : '#f1f5f9' }]}
              hitSlop={8}
            >
              <Text size={20} color={COLORS.primary} style={{ lineHeight: 26 }}>+</Text>
            </Pressable>

            {/* Eliminar medición */}
            {readings.length > 1 ? (
              <Pressable onPress={() => removeReading(r.id)} hitSlop={8} style={{ marginLeft: 2 }}>
                <Icon icon={ICONS.delete} size={20} color={COLORS.textQuaternary} />
              </Pressable>
            ) : (
              <View style={{ width: 22, marginLeft: 2 }} />
            )}
          </View>
        );
      })}

      {/* ── Botón agregar medición ── */}
      {readings.length < maxReadings && (
        <Button type="secondary" onPress={addReading}>
          + Agregar medición
        </Button>
      )}
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────
const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius:    14,
    padding:         16,
    shadowColor:     COLORS.black,
    shadowOpacity:   0.05,
    shadowRadius:    8,
    shadowOffset:    { width: 0, height: 2 },
    elevation:       2,
  },
  cardHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   14,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
});

const inner = StyleSheet.create({
  idealMarker: {
    position:        'absolute',
    top:             2,
    width:           1,
    height:          6,
    backgroundColor: COLORS.success,
    opacity:         0.7,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  10,
    gap:           8,
  },
  stepBtn: {
    width:          36,
    height:         36,
    borderRadius:   18,
    alignItems:     'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  4,
  },
  valueInput: {
    fontSize:   15,
    fontWeight: '700',
    maxWidth:   30,
    minWidth:   20,
    padding:    0,
    margin:     0,
  },
});
