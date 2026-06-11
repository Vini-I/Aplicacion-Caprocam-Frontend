/**
 * SingleWheelCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Card con un único valor tappable que abre un bottom sheet
 * con WheelPicker. Misma lógica que DualWheelCard pero para
 * parámetros con un solo campo (ej. Turbidez Secchi).
 *
 * Props
 * ─────
 *  title       string     — "Turbidez Secchi"
 *  icon        string     — nombre de Ionicons
 *  label       string     — "Lectura disco Secchi"
 *  unit        string     — "cm"
 *  min         number
 *  max         number
 *  step        number     — default 1
 *  idealMin    number
 *  idealMax    number
 *  value       number
 *  onChange    fn(number)
 *  colors      object     — { primary, textHint, border?, text? }
 *  styles      object     — { card, cardHeader, cardHeaderLeft,
 *                             cardTitle }
 *
 * Uso
 * ───
 *  const [secchi, setSecchi] = useState(35);
 *
 *  <SingleWheelCard
 *    title="Turbidez Secchi"
 *    icon="eye-outline"
 *    label="Lectura disco Secchi"
 *    unit="cm"
 *    min={1}
 *    max={100}
 *    idealMin={25}
 *    idealMax={45}
 *    value={secchi}
 *    onChange={setSecchi}
 *    colors={C}
 *    styles={styles}
 *  />
 * ─────────────────────────────────────────────────────────────
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
import { Ionicons } from '@expo/vector-icons';
import WheelPicker from './WheelPicker';

function range(min, max, step = 1) {
  const result = [];
  for (let v = min; v <= max; v = parseFloat((v + step).toFixed(10))) {
    result.push(parseFloat(v.toFixed(10)));
  }
  return result;
}

export default function SingleWheelCard({
  title,
  icon,
  label,
  unit        = '',
  min,
  max,
  step        = 1,
  idealMin,
  idealMax,
  value,
  onChange,
  colors: C,
  styles: S,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tempValue, setTempValue] = useState(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const values = range(min, max, step);
  const isOk   = value >= idealMin && value <= idealMax;
  const sheetOk = tempValue != null
    ? tempValue >= idealMin && tempValue <= idealMax
    : false;

  // ── Abrir ─────────────────────────────────────────────────
  const openSheet = () => {
    setTempValue(value);
    setSheetOpen(true);
    Animated.spring(slideAnim, {
      toValue:         0,
      useNativeDriver: true,
      tension:         65,
      friction:        11,
    }).start();
  };

  // ── Animación base de cierre ──────────────────────────────
  const animateClose = (onDone) => {
    Animated.timing(slideAnim, {
      toValue:         300,
      duration:        220,
      useNativeDriver: true,
    }).start(() => {
      setSheetOpen(false);
      setTempValue(null);
      onDone?.();
    });
  };

  // ── Guardar + cerrar (Listo y tap fuera) ──────────────────
  const saveAndClose = () => {
    const valueToSave = tempValue;
    animateClose(() => {
      if (valueToSave !== null) onChange?.(valueToSave);
    });
  };

  // ── Cancelar ──────────────────────────────────────────────
  const cancelSheet = () => animateClose();

  return (
    <>
      <View style={S.card}>
        {/* Header */}
        <View style={S.cardHeader}>
          <View style={S.cardHeaderLeft}>
            <Ionicons name={icon} size={18} color={C.primary} />
            <Text style={S.cardTitle}>{title}</Text>
          </View>
          {/* Rango ideal en el header, igual que el diseño original */}
          <Text style={[inner.headerIdeal, { color: C.primary }]}>
            Ideal: {idealMin}–{idealMax} {unit}
          </Text>
        </View>

        {/* Valor tappable */}
        <TouchableOpacity
          onPress={openSheet}
          activeOpacity={0.7}
          style={inner.valueBox}
        >
          <Text style={[inner.valueLabel, { color: C.textHint }]}>
            {label}
          </Text>
          <View style={[inner.valueDisplay, { borderColor: C.border ?? '#E2E8F0' }]}>
            <Text style={[inner.valueNumber, { color: isOk ? '#22c55e' : C.text ?? '#1E293B' }]}>
              {value}
            </Text>
            <Text style={[inner.valueUnit, { color: C.textHint }]}>
              {unit}
            </Text>
            {isOk
              ? <Ionicons name="checkmark-circle" size={14} color="#22c55e" style={{ marginLeft: 4 }} />
              : <Ionicons name="remove-circle"    size={14} color="#f97316" style={{ marginLeft: 4 }} />
            }
          </View>
          <Text style={[inner.idealText, { color: C.textHint }]}>
            Ideal: {idealMin}–{idealMax} {unit}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="none"
        onRequestClose={saveAndClose}
      >
        <TouchableWithoutFeedback onPress={saveAndClose}>
          <View style={inner.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[inner.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={inner.handle} />

          {/* Header del sheet */}
          <View style={inner.sheetHeader}>
            <Pressable onPress={cancelSheet} hitSlop={8}>
              <Text style={[inner.sheetCancel, { color: C.textHint }]}>
                Cancelar
              </Text>
            </Pressable>

            <View style={{ alignItems: 'center' }}>
              <Text style={[inner.sheetTitle, { color: C.text ?? '#1E293B' }]}>
                {title}
              </Text>
              <Text style={[inner.sheetIdeal, { color: C.textHint }]}>
                Ideal: {idealMin}–{idealMax} {unit}
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
              values={values}
              value={tempValue}
              onChange={setTempValue}
              unit={unit}
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
  headerIdeal: {
    fontSize:   12,
    fontWeight: '500',
  },
  valueBox: {
    paddingVertical:   4,
    paddingHorizontal: 4,
    marginTop:         4,
  },
  valueLabel: {
    fontSize:     12,
    fontWeight:   '600',
    marginBottom: 6,
  },
  valueDisplay: {
    flexDirection:     'row',
    alignItems:        'center',
    borderWidth:       1,
    borderRadius:      8,
    paddingHorizontal: 12,
    paddingVertical:   10,
    marginBottom:      4,
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
  backdrop: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position:              'absolute',
    bottom:                0,
    left:                  0,
    right:                 0,
    backgroundColor:       '#FFFFFF',
    borderTopLeftRadius:   20,
    borderTopRightRadius:  20,
    paddingHorizontal:     20,
    paddingTop:            12,
    shadowColor:           '#000',
    shadowOffset:          { width: 0, height: -3 },
    shadowOpacity:         0.1,
    shadowRadius:          12,
    elevation:             20,
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
