/**
 * DualWheelCard.jsx — fixed
 * Fixes:
 *  1. Tocar fuera del sheet (backdrop) GUARDA el valor actual (igual que "Listo").
 *  2. confirmSheet y closeWithSave comparten la misma lógica de persistencia.
 *  3. closeSheet (sin guardar) solo se usa en "Cancelar".
 *  4. El sheet ya no descarta el valor al hacer tap fuera.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';
import WheelPicker from './WheelPicker';
import { Ionicons } from '@expo/vector-icons';


function range(min, max, step = 1) {
  const result = [];
  for (let v = min; v <= max; v = parseFloat((v + step).toFixed(10))) {
    result.push(parseFloat(v.toFixed(10)));
  }
  return result;
}

export default function DualWheelCard({
  title,
  icon,
  leftLabel,
  leftUnit,
  leftMin,
  leftMax,
  leftStep = 1,
  leftIdealMin,
  leftIdealMax,
  leftValue,
  onLeftChange,
  rightLabel,
  rightUnit,
  rightMin,
  rightMax,
  rightStep = 1,
  rightIdealMin,
  rightIdealMax,
  rightValue,
  onRightChange,
  colors: C,
  styles: S,
}) {
  const [activeSheet, setActiveSheet] = useState(null);
  const [tempValue, setTempValue]     = useState(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const leftValues  = range(leftMin,  leftMax,  leftStep);
  const rightValues = range(rightMin, rightMax, rightStep);

  const leftOk  = leftValue  >= leftIdealMin  && leftValue  <= leftIdealMax;
  const rightOk = rightValue >= rightIdealMin && rightValue <= rightIdealMax;

  // ── Abre el sheet ─────────────────────────────────────────
  const openSheet = (side) => {
    const current = side === 'left' ? leftValue : rightValue;
    setTempValue(current);
    setActiveSheet(side);
    Animated.spring(slideAnim, {
      toValue:     0,
      useNativeDriver: true,
      tension:     65,
      friction:    11,
    }).start();
  };

  // ── Animación de cierre (base) ────────────────────────────
  const animateClose = (onDone) => {
    Animated.timing(slideAnim, {
      toValue:         300,
      duration:        220,
      useNativeDriver: true,
    }).start(() => {
      setActiveSheet(null);
      setTempValue(null);
      onDone?.();
    });
  };

  // ── Guardar + cerrar (Listo y tap fuera) ──────────────────
  const saveAndClose = () => {
    // Capturamos tempValue antes de que animateClose lo limpie
    const valueToSave = tempValue;
    const side        = activeSheet;
    animateClose(() => {
      if (valueToSave !== null) {
        if (side === 'left')  onLeftChange?.(valueToSave);
        else                  onRightChange?.(valueToSave);
      }
    });
  };

  // ── Cancelar (descarta el cambio) ─────────────────────────
  const cancelSheet = () => {
    animateClose();
  };

  // ── Datos del sheet activo ────────────────────────────────
  const sheetLabel    = activeSheet === 'left' ? leftLabel    : rightLabel;
  const sheetUnit     = activeSheet === 'left' ? leftUnit     : rightUnit;
  const sheetValues   = activeSheet === 'left' ? leftValues   : rightValues;
  const sheetIdealMin = activeSheet === 'left' ? leftIdealMin : rightIdealMin;
  const sheetIdealMax = activeSheet === 'left' ? leftIdealMax : rightIdealMax;
  const sheetOk       = tempValue != null
    ? tempValue >= sheetIdealMin && tempValue <= sheetIdealMax
    : false;

  return (
    <>
      <View style={S.card}>
        {/* Header */}
        <View style={S.cardHeader}>
          <View style={S.cardHeaderLeft}>
            <Ionicons name={icon} size={18} color={C.primary} />
            <Text style={S.cardTitle}>{title}</Text>
          </View>
        </View>

        {/* Valores tappables */}
        <View style={inner.row}>
          {/* Izquierdo */}
          <TouchableOpacity
            onPress={() => openSheet('left')}
            activeOpacity={0.7}
            style={inner.valueBox}
          >
            <Text style={[inner.valueLabel, { color: C.textHint }]}>
              {leftLabel}
            </Text>
            <View style={[inner.valueDisplay, { borderColor: C.border ?? '#E2E8F0' }]}>
              <Text style={[inner.valueNumber, { color: leftOk ? '#22c55e' : C.text ?? '#1E293B' }]}>
                {leftValue}
              </Text>
              <Text style={[inner.valueUnit, { color: C.textHint }]}>
                {leftUnit}
              </Text>
              {leftOk
                ? <Ionicons name="checkmark-circle" size={14} color="#22c55e" style={{ marginLeft: 4 }} />
                : <Ionicons name="remove-circle" size={14} color="#f97316" style={{ marginLeft: 4 }} />
              }
            </View>
            <Text style={[inner.idealText, { color: C.textHint }]}>
              {leftIdealMin}–{leftIdealMax} {leftUnit}
            </Text>
          </TouchableOpacity>

          {/* Divisor */}
          <View style={[inner.divider, { backgroundColor: C.border ?? '#E2E8F0' }]} />

          {/* Derecho */}
          <TouchableOpacity
            onPress={() => openSheet('right')}
            activeOpacity={0.7}
            style={inner.valueBox}
          >
            <Text style={[inner.valueLabel, { color: C.textHint }]}>
              {rightLabel}
            </Text>
            <View style={[inner.valueDisplay, { borderColor: C.border ?? '#E2E8F0' }]}>
              <Text style={[inner.valueNumber, { color: rightOk ? '#22c55e' : C.text ?? '#1E293B' }]}>
                {rightValue}
              </Text>
              <Text style={[inner.valueUnit, { color: C.textHint }]}>
                {rightUnit}
              </Text>
              {rightOk
                ? <Ionicons name="checkmark-circle" size={14} color="#22c55e" style={{ marginLeft: 4 }} />
                : <Ionicons name="remove-circle" size={14} color="#f97316" style={{ marginLeft: 4 }} />
              }
            </View>
            <Text style={[inner.idealText, { color: C.textHint }]}>
              {rightIdealMin}–{rightIdealMax} {rightUnit}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={activeSheet !== null}
        transparent
        animationType="none"
        onRequestClose={saveAndClose}
      >
        {/* Fondo oscuro — guarda al tocar fuera */}
        <TouchableWithoutFeedback onPress={saveAndClose}>
          <View style={inner.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[inner.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Handle */}
          <View style={inner.handle} />

          {/* Header */}
          <View style={inner.sheetHeader}>
            <Pressable onPress={cancelSheet} hitSlop={8}>
              <Text style={[inner.sheetCancel, { color: C.textHint }]}>
                Cancelar
              </Text>
            </Pressable>

            <View style={{ alignItems: 'center' }}>
              <Text style={[inner.sheetTitle, { color: C.text ?? '#1E293B' }]}>
                {sheetLabel}
              </Text>
              <Text style={[inner.sheetIdeal, { color: C.textHint }]}>
                Ideal: {sheetIdealMin}–{sheetIdealMax} {sheetUnit}
              </Text>
            </View>

            <Pressable onPress={saveAndClose} hitSlop={8}>
              <Text style={[inner.sheetConfirm, { color: C.primary }]}>
                Listo
              </Text>
            </Pressable>
          </View>

          {/* Indicador de rango */}
          <View style={inner.sheetRangeRow}>
            <View style={[inner.rangeDot, { backgroundColor: sheetOk ? '#22c55e' : '#f97316' }]} />
            <Text style={[inner.rangeText, { color: sheetOk ? '#22c55e' : '#f97316' }]}>
              {sheetOk ? 'En rango ideal' : 'Fuera del rango ideal'}
            </Text>
          </View>

          {/* Wheel */}
          {tempValue !== null && (
            <WheelPicker
              values={sheetValues}
              value={tempValue}
              onChange={setTempValue}
              unit={sheetUnit}
              color={sheetOk ? '#22c55e' : C.primary}
              textHint={C.textHint}
            />
          )}

          <View style={{ height: 24 }} />
        </Animated.View>
      </Modal>
    </>
  );
}

const inner = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:    'stretch',
    marginTop:     4,
  },
  valueBox: {
    flex:           1,
    alignItems:     'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  valueLabel: {
    fontSize:    12,
    fontWeight:  '600',
    marginBottom: 6,
  },
  valueDisplay: {
    flexDirection:    'row',
    alignItems:       'center',
    borderWidth:      1,
    borderRadius:     8,
    paddingHorizontal: 12,
    paddingVertical:  10,
    width:            '100%',
    marginBottom:     4,
  },
  valueNumber: {
    fontSize:   16,
    fontWeight: '700',
    flex:       1,
  },
  valueUnit: {
    fontSize: 13,
  },
  idealText: {
    fontSize: 11,
    opacity:  0.7,
  },
  divider: {
    width:           1,
    marginHorizontal: 8,
    marginVertical:  4,
    opacity:         0.4,
  },
  backdrop: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position:           'absolute',
    bottom:             0,
    left:               0,
    right:              0,
    backgroundColor:    '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal:  20,
    paddingTop:         12,
    shadowColor:        '#000',
    shadowOffset:       { width: 0, height: -3 },
    shadowOpacity:      0.1,
    shadowRadius:       12,
    elevation:          20,
  },
  handle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: '#E2E8F0',
    alignSelf:       'center',
    marginBottom:    16,
  },
  sheetHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   12,
  },
  sheetTitle: {
    fontSize:   15,
    fontWeight: '700',
  },
  sheetIdeal: {
    fontSize:  11,
    marginTop: 2,
  },
  sheetCancel: {
    fontSize:   14,
    fontWeight: '500',
  },
  sheetConfirm: {
    fontSize:   14,
    fontWeight: '700',
  },
  sheetRangeRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   8,
    gap:            6,
  },
  rangeDot: {
    width:        7,
    height:       7,
    borderRadius: 4,
  },
  rangeText: {
    fontSize:   12,
    fontWeight: '600',
  },
});
