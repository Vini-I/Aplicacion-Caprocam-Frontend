/**
 * RangeCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Componente reutilizable para captura de parámetros fisicoquímicos.
 * Sin dependencias externas — solo React Native nativo.
 *
 * Props
 * ─────
 *  title          string          — "Temperatura"
 *  unit           string          — "°C" | "pH" | "ppt" | "mg/L"
 *  icon           string          — nombre de Ionicons (e.g. "thermometer")
 *  idealMin       number          — límite inferior del rango ideal
 *  idealMax       number          — límite superior del rango ideal
 *  sliderMin      number          — mínimo absoluto del control
 *  sliderMax      number          — máximo absoluto del control
 *  step           number          — incremento del botón +/- (default 0.1)
 *  decimals       number          — decimales a mostrar y validar (default 1)
 *  maxReadings    number          — máximo de mediciones permitidas (default 4)
 *  showProgress   bool            — muestra progress bar global (default true)
 *  showRangeColor bool            — colorea verde/naranja según rango (default true)
 *  badgeLabel     string          — texto del badge (default "Ideal: min–max unit")
 *  colors         object          — { primary, textHint }  ← tu objeto C
 *  styles         object          — { card, cardHeader, cardHeaderLeft,
 *                                     cardTitle, cardUnit, badge }
 *  onChange       fn([readings])  — callback al padre con array de mediciones
 *                                   Cada reading: { id, value, rawInput, editing }
 *
 * Ejemplos de uso
 * ───────────────
 *  // Temperatura — con progress bar y colores de rango
 *  <RangeCard
 *    title="Temperatura"  unit="°C"   icon="thermometer"
 *    idealMin={28}        idealMax={30}
 *    sliderMin={15}       sliderMax={45}
 *    step={0.5}           decimals={1}
 *    maxReadings={4}
 *    colors={C}           styles={styles}
 *    onChange={(r) => setTempReadings(r)}
 *  />
 *
 *  // pH — con progress bar y colores de rango
 *  <RangeCard
 *    title="pH"           unit="pH"   icon="flask-outline"
 *    idealMin={7.5}       idealMax={8.5}
 *    sliderMin={4}        sliderMax={10}
 *    step={0.1}           decimals={1}
 *    maxReadings={4}
 *    colors={C}           styles={styles}
 *    onChange={(r) => setPhReadings(r)}
 *  />
 *
 *  // Oxígeno disuelto — sin progress bar ni colores de rango
 *  <RangeCard
 *    title="Oxígeno Disuelto"  unit="mg/L"  icon="water"
 *    idealMin={5}              idealMax={20}
 *    sliderMin={0}             sliderMax={20}
 *    step={0.1}                decimals={1}
 *    maxReadings={5}
 *    showProgress={false}
 *    showRangeColor={false}
 *    badgeLabel="Mín: 5 mg/L"
 *    colors={C}                styles={styles}
 *    onChange={(r) => setOxReadings(r)}
 *  />
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import ProgressBar from '../../../shared/components/ProgressBar';
import Button from '../../../shared/components/Button';
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
  labelStyle = 'numeric', // 'numeric' | 'daynight'
  badgeLabel,
  colors: C,
  styles: S,
  onChange,
}) {
  const [readings, setReadings] = useState([
    makeReading(1, idealMin, decimals),
  ]);

  // ── Actualiza un campo de un reading por id ───────────────
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

  // ── Agrega una nueva medición ─────────────────────────────
  const addReading = () => {
    if (readings.length >= maxReadings) return;
    setReadings((prev) => {
      const next = [...prev, makeReading(Date.now(), idealMin, decimals)];
      onChange?.(next);
      return next;
    });
  };

  // ── Elimina una medición ──────────────────────────────────
  const removeReading = (id) => {
    if (readings.length <= 1) return;
    setReadings((prev) => {
      const next = prev.filter((r) => r.id !== id);
      onChange?.(next);
      return next;
    });
  };

  // ── Normaliza un valor al rango [0, 1] ────────────────────
  const normalize = (v) => (v - sliderMin) / (sliderMax - sliderMin);

  // ── Progreso global (promedio de todos los readings) ──────
  const avg = readings.reduce((s, r) => s + r.value, 0) / readings.length;
  const allOk = readings.every(
    (r) => r.value >= idealMin && r.value <= idealMax
  );
  const globalProgress = Math.min(Math.max(normalize(avg), 0), 1);
  const barColor = allOk
    ? '#22c55e'
    : globalProgress > 0
      ? '#f97316'
      : '#e2e8f0';

  // Posición % de los marcadores del rango ideal
  const markerLeft = `${normalize(idealMin) * 100}%`;
  const markerRight = `${normalize(idealMax) * 100}%`;

  const LABELS = labelStyle === 'daynight' ? LABELS_DAYNIGHT : LABELS_NUMERIC;



  // Badge: usa badgeLabel si se pasa, si no construye el default
  const resolvedBadge =
    badgeLabel ?? `Ideal: ${idealMin}–${idealMax} ${unit}`;


  return (
    <View style={S.card}>
      {/* ── Header ─────────────────────────────────────────── */}
      <View style={S.cardHeader}>
        <View style={S.cardHeaderLeft}>
          <Ionicons name={icon} size={18} color={C.primary} />
          <Text style={S.cardTitle}>{title}</Text>
          <Text style={S.cardUnit}> ({unit})</Text>
        </View>
        <Text style={S.badge}>{resolvedBadge}</Text>
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
            {[markerLeft, markerRight].map((pos, i) => (
              <View key={i} style={[inner.idealMarker, { left: pos }]} />
            ))}
          </View>
        </View>
      )}

      {/* ── Mediciones ─────────────────────────────────────── */}
      {readings.map((r, idx) => {
        const inRange = r.value >= idealMin && r.value <= idealMax;
        const showGreen = showRangeColor && inRange;
        const readingProgress = Math.min(Math.max(normalize(r.value), 0), 1);
        const miniBarColor = showGreen ? '#22c55e' : C.primary;

        // Decrementar con paso
        const decrement = () => {
          const next = parseFloat(
            clamp(r.value - step, sliderMin, sliderMax).toFixed(decimals)
          );
          updateReading(r.id, { value: next, rawInput: fmt(next, decimals) });
        };

        // Incrementar con paso
        const increment = () => {
          const next = parseFloat(
            clamp(r.value + step, sliderMin, sliderMax).toFixed(decimals)
          );
          updateReading(r.id, { value: next, rawInput: fmt(next, decimals) });
        };

        // Cambio de texto: solo números y punto, máx 2 dígitos enteros
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

        // Al perder el foco: fija y limpia el valor
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
                <Image
                  source={lbl.source}
                  style={{ width: 18, height: 18, tintColor: C.primary }}
                />
              ) : (
                <Text style={[inner.label, { color: C.textHint }]}>
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
              <Text style={[inner.stepBtnText, { color: C.primary }]}>−</Text>
            </Pressable>

            {/* Valor + mini barra ────────────────────────────── */}
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
                <Text style={[inner.unitLabel, { color: C.textHint }]}>
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

              {/* Mini track individual */}
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
              <Text style={[inner.stepBtnText, { color: C.primary }]}>+</Text>
            </Pressable>

            {/* Eliminar medición (solo si hay más de 1) */}
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

// ── Estilos internos del componente ──────────────────────────
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    width: 22,
    textAlign: 'center',
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '400',
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
  unitLabel: {
    fontSize: 13,
    marginLeft: 3,
    fontWeight: '600',
  },
});
