/**
 * ============================================================
 * COMPONENTE SINGLEWHEELCARD
 * ============================================================
 *
 * Este componente se utiliza para mostrar una tarjeta que abre
 * un selector tipo ruleta y permite elegir un unico valor.
 *
 * Permite:
 * - Mostrar el valor actual de forma resumida
 * - Abrir un modal inferior con la ruleta
 * - Confirmar o cancelar el cambio antes de guardarlo
 * - Resaltar si el valor esta dentro del rango ideal
 *
 * ---
 * PARAMETROS
 * ---
 *
 * title
 * Titulo visible en la tarjeta.
 *
 * label
 * Texto descriptivo del valor.
 *
 * unit
 * Unidad de medida mostrada junto al valor.
 *
 * min / max
 * Rango de valores disponibles en la ruleta.
 *
 * idealMin / idealMax
 * Rango ideal usado para la validacion visual.
 *
 * value
 * Valor actual seleccionado.
 *
 * onChange
 * Funcion que recibe el valor confirmado por el usuario.
 *
 * ============================================================
 * EJEMPLOS RAPIDOS
 * ============================================================
 *
 * <SingleWheelCard
 *   title="Salinidad"
 *   label="Salinidad"
 *   unit="ppt"
 *   min={5}
 *   max={40}
 *   idealMin={10}
 *   idealMax={25}
 *   value={salinidad}
 *   onChange={setSalinidad}
 * />
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WheelPicker from './WheelPicker';
import Button from '../../../shared/components/Button';
import Text from '../../../shared/components/Text';
import Title from '../../../shared/components/Title';

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

  const values  = range(min, max, step);
  const isOk    = value >= idealMin && value <= idealMax;
  const sheetOk = tempValue != null
    ? tempValue >= idealMin && tempValue <= idealMax
    : false;

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

  const saveAndClose = () => {
    const valueToSave = tempValue;
    animateClose(() => {
      if (valueToSave !== null) onChange?.(valueToSave);
    });
  };

  const cancelSheet = () => animateClose();

  return (
    <>
      <View style={S.card}>
        {/* ── Header ── */}
        <View style={S.cardHeader}>
          <View style={S.cardHeaderLeft}>
            <Ionicons name={icon} size={18} color={C.primary} />
            {/* SUSTITUIDO: Text estilo cardTitle → Title */}
            <Title level={5} color={C.text}>
              {title}
            </Title>
          </View>
          {/* SUSTITUIDO: Text estilo headerIdeal → Text compartido */}
          <Text tamano="xs" color={C.primary} estilo={{ fontWeight: '500' }}>
            Ideal: {idealMin}–{idealMax} {unit}
          </Text>
        </View>

        {/* ── Valor tappable ── */}
        <TouchableOpacity
          onPress={openSheet}
          activeOpacity={0.7}
          style={inner.valueBox}
        >
          {/* SUSTITUIDO: Text estilo valueLabel → Text compartido */}
          <Text tamano="xs" color={C.textHint} estilo={{ fontWeight: '600', marginBottom: 6 }}>
            {label}
          </Text>
          <View style={[inner.valueDisplay, { borderColor: C.border ?? '#E2E8F0' }]}>
            {/* SUSTITUIDO: Text estilo valueNumber → Text compartido */}
            <Text
              tamano="md"
              color={isOk ? '#22c55e' : C.text ?? '#1E293B'}
              estilo={{ fontWeight: '700', flex: 1 }}
            >
              {value}
            </Text>
            {/* SUSTITUIDO: Text estilo valueUnit → Text compartido */}
            <Text tamano="sm" color={C.textHint}>
              {unit}
            </Text>
            {isOk
              ? <Ionicons name="checkmark-circle" size={14} color="#22c55e" style={{ marginLeft: 4 }} />
              : <Ionicons name="remove-circle"    size={14} color="#f97316" style={{ marginLeft: 4 }} />
            }
          </View>
          {/* SUSTITUIDO: Text estilo idealText → Text compartido */}
          <Text tamano="xs" color={C.textHint} estilo={{ opacity: 0.7 }}>
            Ideal: {idealMin}–{idealMax} {unit}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Bottom Sheet Modal ── */}
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
            {/* SUSTITUIDO: Pressable "Cancelar" → Button secondary */}
            <Button
              title="Cancelar"
              type="secondary"
              onPress={cancelSheet}
            />

            <View style={{ alignItems: 'center' }}>
              {/* SUSTITUIDO: Text sheetTitle → Title */}
              <Title level={5} color={C.text ?? '#1E293B'} align="center">
                {title}
              </Title>
              {/* SUSTITUIDO: Text sheetIdeal → Text compartido */}
              <Text tamano="xs" color={C.textHint} alineacion="center">
                Ideal: {idealMin}–{idealMax} {unit}
              </Text>
            </View>

            {/* SUSTITUIDO: Pressable "Listo" → Button primary */}
            <Button
              title="Listo"
              type="primary"
              onPress={saveAndClose}
            />
          </View>

          {/* Indicador de rango */}
          <View style={inner.sheetRangeRow}>
            <View style={[inner.rangeDot, { backgroundColor: sheetOk ? '#22c55e' : '#f97316' }]} />
            {/* SUSTITUIDO: Text rangeText → Text compartido */}
            <Text
              tamano="xs"
              color={sheetOk ? '#22c55e' : '#f97316'}
              estilo={{ fontWeight: '600' }}
            >
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
  valueBox: {
    paddingVertical:   4,
    paddingHorizontal: 4,
    marginTop:         4,
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
});
