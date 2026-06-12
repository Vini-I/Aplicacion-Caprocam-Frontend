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
 * Ejemplo:
 * <RangeCard title="Temperatura" />
 *
 * ---
 *
 * unit
 * Unidad de medida que acompana el valor.
 *
 * Ejemplo:
 * <RangeCard unit="mg/L" />
 *
 * ---
 *
 * idealMin / idealMax
 * Define el rango ideal. Si idealMax no se envia, el
 * componente funciona como minimo recomendado.
 *
 * Ejemplo:
 * <RangeCard idealMin={5} idealMax={20} />
 *
 * <RangeCard idealMin={5} />
 *
 * ---
 *
 * sliderMin / sliderMax
 * Limites permitidos para la medicion.
 *
 * ---
 *
 * step
 * Incremento o decremento aplicado por los botones.
 *
 * ---
 *
 * maxReadings
 * Cantidad maxima de mediciones permitidas.
 *
 * ---
 *
 * labelStyle
 * Define el tipo de etiqueta para cada medicion.
 * Valores posibles: "numeric" | "daynight"
 *
 * ---
 *
 * onChange
 * Funcion que recibe el arreglo actualizado de mediciones.
 *
 * Ejemplo:
 * <RangeCard onChange={(values) => setValores(values)} />
 *
 * ============================================================
 * EJEMPLOS RAPIDOS
 * ============================================================
 *
 * <RangeCard
 *   title="pH"
 *   unit="pH"
 *   idealMin={7.5}
 *   idealMax={8.5}
 *   sliderMin={4}
 *   sliderMax={10}
 * />
 *
 * <RangeCard
 *   title="Oxigeno Disuelto"
 *   unit="mg/L"
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
import Button from '../../../shared/components/Button';
import Text from '../../../shared/components/Text';
import Title from '../../../shared/components/Title';
import Images from '../../../shared/components/Images';
import { Ionicons } from '@expo/vector-icons';

// ── Etiquetas para hasta 5 mediciones ────────────────────────
const LABELS_DAYNIGHT = [
  { type: 'icon', source: require('./sun.png') },
  { type: 'icon', source: require('./moonIcon.png') },
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
const fmt = (val, decimals) => val.toFixed(decimals);

function makeReading(id, value, decimals) {
  return { id, value, rawInput: fmt(value, decimals), editing: false };
}

// ── Componente ───────────────────────────────────────────────
export default function RangeCard({
  title,
  unit,
  icon,
  idealMin,
  idealMax,
  sliderMin,
  sliderMax,
  step = 0.1,
  decimals = 1,
  maxReadings = 4,
  showProgress = true,
  showRangeColor = true,
  labelStyle = 'numeric',
  badgeLabel,
  colors: C,
  styles: S,
  onChange,
}) {
  const [readings, setReadings] = useState([
    makeReading(1, idealMin, decimals),
  ]);

  const updateReading = useCallback(
    (id, patch) => {
      setReadings((prev) => {
        const next = prev.map((r) =>
          r.id === id ? { ...r, ...patch } : r
        );
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

  const normalize = (v) => (v - sliderMin) / (sliderMax - sliderMin);
  const hasUpperIdeal = Number.isFinite(idealMax);

  const avg = readings.reduce((s, r) => s + r.value, 0) / readings.length;
  const allOk = readings.every((r) =>
    hasUpperIdeal
      ? r.value >= idealMin && r.value <= idealMax
      : r.value >= idealMin
  );
  const globalProgress = Math.min(Math.max(normalize(avg), 0), 1);
  const barColor = allOk
    ? '#22c55e'
    : globalProgress > 0
      ? '#f97316'
      : '#e2e8f0';

  const markerLeft = `${normalize(idealMin) * 100}%`;
  const markerRight = hasUpperIdeal ? `${normalize(idealMax) * 100}%` : null;

  const LABELS = labelStyle === 'daynight' ? LABELS_DAYNIGHT : LABELS_NUMERIC;

  const resolvedBadge =
    badgeLabel ?? (hasUpperIdeal
      ? `Ideal: ${idealMin}–${idealMax} ${unit}`
      : `Min ${idealMin} ${unit}`);

  return (
    <View style={S.card}>
      {/* ── Header ─────────────────────────────────────────── */}
      <View style={S.cardHeader}>
        <View style={S.cardHeaderLeft}>
          <Ionicons name={icon} size={18} color={C.primary} />
          {/* SUSTITUIDO: Text estilo cardTitle → Title */}
          <Title level={5} color={C.text}>
            {title}
          </Title>
          {/* SUSTITUIDO: Text estilo cardUnit → Text compartido */}
          <Text tamano="sm" color={C.textSub}>
            ({unit})
          </Text>
        </View>
        {/* SUSTITUIDO: Text estilo badge → Text compartido */}
        <Text tamano="xs" color={C.primary}>
          {resolvedBadge}
        </Text>
      </View>

      {/* ── Progress bar global (opcional) ─────────────────── */}
      {showProgress && (
        <View style={{ marginBottom: 14 }}>
          <ProgressBar
            label={`Promedio: ${fmt(avg, decimals)} ${unit}`}
            value={Math.round(globalProgress * 100)}
            color={barColor}
            backgroundColor="#e2e8f0"
            showPercentage={false}
          />
          <View style={{ position: 'relative', height: 12 }}>
            <View style={[inner.idealMarker, { left: markerLeft }]} />
            {markerRight && (
              <View style={[inner.idealMarker, { left: markerRight }]} />
            )}
          </View>
        </View>
      )}

      {/* ── Mediciones ─────────────────────────────────────── */}
      {readings.map((r, idx) => {
        const inRange = r.value >= idealMin && r.value <= idealMax;
        const inMinRange = r.value >= idealMin;
        const showGreen = showRangeColor && (hasUpperIdeal ? inRange : inMinRange);
        const readingProgress = Math.min(Math.max(normalize(r.value), 0), 1);
        const miniBarColor = showGreen ? '#22c55e' : C.primary;

        const decrement = () => {
          const next = parseFloat(
            clamp(r.value - step, sliderMin, sliderMax).toFixed(decimals)
          );
          updateReading(r.id, { value: next, rawInput: fmt(next, decimals) });
        };

        const increment = () => {
          const next = parseFloat(
            clamp(r.value + step, sliderMin, sliderMax).toFixed(decimals)
          );
          updateReading(r.id, { value: next, rawInput: fmt(next, decimals) });
        };

        const handleChangeText = (text) => {
          const cleaned = text.replace(/[^0-9.]/g, '');
          const parts = cleaned.split('.');
          const integer = parts[0].slice(0, 2);
          const result =
            parts.length > 1 ? `${integer}.${parts[1]}` : integer;

          updateReading(r.id, { rawInput: result });
          const parsed = parseFloat(result);
          if (!isNaN(parsed)) {
            const clamped = parseFloat(
              clamp(parsed, sliderMin, sliderMax).toFixed(decimals)
            );
            updateReading(r.id, { rawInput: result, value: clamped });
          }
        };

        const handleBlur = () => {
          const parsed = parseFloat(r.rawInput);
          const safe = isNaN(parsed)
            ? r.value
            : parseFloat(
              clamp(parsed, sliderMin, sliderMax).toFixed(decimals)
            );
          updateReading(r.id, {
            value: safe,
            rawInput: fmt(safe, decimals),
            editing: false,
          });
        };

        return (
          <View key={r.id} style={inner.readingRow}>
            {/* Etiqueta ①②③… */}
            {(() => {
              const lbl = LABELS[idx] ?? { type: 'text', value: `${idx + 1}` };
              return lbl.type === 'icon' ? (
                <Images
                  Icon={lbl.source}
                  Width={18}
                  Height={18}
                />
              ) : (
                /* SUSTITUIDO: Text estilo inner.label → Text compartido */
                <Text tamano="sm" color={C.textHint} estilo={{ width: 22, textAlign: 'center' }}>
                  {lbl.value}
                </Text>
              );
            })()}

            {/* Botón − */}
            <Pressable
              onPress={decrement}
              style={({ pressed }) => [
                inner.stepBtn,
                { backgroundColor: pressed ? '#e2e8f0' : '#f1f5f9' },
              ]}
              hitSlop={8}
            >
              {/* Presiones rápidas de +/− se mantienen como Pressable por hitSlop y feedback táctil */}
              <Text tamano="lg" color={C.primary} estilo={{ lineHeight: 26 }}>
                −
              </Text>
            </Pressable>

            {/* Valor + mini barra */}
            <View style={{ flex: 1 }}>
              <View style={inner.valueRow}>
                <TextInput
                  value={r.editing ? r.rawInput : fmt(r.value, decimals)}
                  onChangeText={handleChangeText}
                  onFocus={() =>
                    updateReading(r.id, {
                      editing: true,
                      rawInput: fmt(r.value, decimals),
                    })
                  }
                  onBlur={handleBlur}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                  style={[
                    inner.valueInput,
                    {
                      color: showGreen ? '#22c55e' : C.primary,
                      borderBottomColor: C.primary,
                      borderBottomWidth: r.editing ? 1.5 : 0,
                    },
                  ]}
                />
                {/* SUSTITUIDO: Text estilo unitLabel → Text compartido */}
                <Text tamano="sm" color={C.textHint} estilo={{ marginLeft: 3, fontWeight: '600' }}>
                  {unit}
                </Text>
                {showGreen && !r.editing && (
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color="#22c55e"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>

              <ProgressBar
                label=""
                value={Math.round(readingProgress * 100)}
                color={miniBarColor}
                backgroundColor="#e2e8f0"
                showPercentage={false}
              />
            </View>

            {/* Botón + */}
            <Pressable
              onPress={increment}
              style={({ pressed }) => [
                inner.stepBtn,
                { backgroundColor: pressed ? '#e2e8f0' : '#f1f5f9' },
              ]}
              hitSlop={8}
            >
              <Text tamano="lg" color={C.primary} estilo={{ lineHeight: 26 }}>
                +
              </Text>
            </Pressable>

            {/* Eliminar medición */}
            {readings.length > 1 ? (
              <Pressable
                onPress={() => removeReading(r.id)}
                hitSlop={8}
                style={{ marginLeft: 2 }}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={20}
                  color="#94a3b8"
                />
              </Pressable>
            ) : (
              <View style={{ width: 22, marginLeft: 2 }} />
            )}
          </View>
        );
      })}

      {/* ── Botón agregar medición ──────────────────────────── */}
      {readings.length < maxReadings && (
        <Button
          title="+ Agregar medición"
          type="secondary"
          onPress={addReading}
        />
      )}
    </View>
  );
}

// ── Estilos internos ──────────────────────────────────────────
const inner = StyleSheet.create({
  idealMarker: {
    position: 'absolute',
    top: 2,
    width: 1,
    height: 6,
    backgroundColor: '#22c55e',
    opacity: 0.7,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  valueInput: {
    fontSize: 15,
    fontWeight: '700',
    maxWidth: 30,
    minWidth: 20,
    padding: 0,
    margin: 0,
  },
});
