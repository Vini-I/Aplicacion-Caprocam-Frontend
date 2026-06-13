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
 * icon
 * Componente <Icon /> ya instanciado como JSX element.
 * Ejemplo: icon={<Icon icon={ICONS.frequency} color={COLORS.primary} size={18} />}
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
 *   icon={<Icon icon={ICONS.frequency} color={COLORS.primary} size={18} />}
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
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import WheelPicker from './WheelPicker';
import Button      from '../../../shared/components/Button';
import Text        from '../../../shared/components/Text';
import Title       from '../../../shared/components/Title';
import Icon        from '../../../shared/components/Icons';
import Modal       from '../../../shared/components/Modal';
import { COLORS }  from '../../../theme/colors';
import { ICONS }   from '../../../theme/icons';

function range(min, max, step = 1) {
  const result = [];
  for (let v = min; v <= max; v = parseFloat((v + step).toFixed(10))) {
    result.push(parseFloat(v.toFixed(10)));
  }
  return result;
}

export default function SingleWheelCard({
  title,
  icon,           // JSX element: <Icon icon={ICONS.x} color={...} size={18} />
  label,
  unit      = '',
  min,
  max,
  step      = 1,
  idealMin,
  idealMax,
  value,
  onChange,
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
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
  };

  const animateClose = (onDone) => {
    Animated.timing(slideAnim, { toValue: 300, duration: 220, useNativeDriver: true }).start(() => {
      setSheetOpen(false);
      setTempValue(null);
      onDone?.();
    });
  };

  const saveAndClose = () => {
    const valueToSave = tempValue;
    animateClose(() => { if (valueToSave !== null) onChange?.(valueToSave); });
  };

  const cancelSheet = () => animateClose();

  return (
    <>
      <View style={s.card}>

        {/* ── Header ── */}
        <View style={s.cardHeader}>
          <View style={s.cardHeaderLeft}>
            {/* icon es un JSX element ya construido — se renderiza directo */}
            {icon}
            <Title level={5} color={COLORS.textPrimary}>
              {title}
            </Title>
          </View>
          <Text size={12} color={COLORS.primary} style={{ fontWeight: '500' }}>
            Ideal: {idealMin}–{idealMax} {unit}
          </Text>
        </View>

        {/* ── Valor tappable ── */}
        <TouchableOpacity onPress={openSheet} activeOpacity={0.7} style={inner.valueBox}>
          <Text size={12} color={COLORS.textQuaternary} style={{ fontWeight: '600', marginBottom: 6 }}>
            {label}
          </Text>
          <View style={[inner.valueDisplay, { borderColor: COLORS.textQuaternary }]}>
            <Text size={16} color={isOk ? COLORS.success : COLORS.textPrimary} style={{ fontWeight: '700', flex: 1 }}>
              {value}
            </Text>
            <Text size={13} color={COLORS.textQuaternary}>
              {unit}
            </Text>
            {isOk
              ? <Icon icon={ICONS.check}  size={14} color={COLORS.success} style={{ marginLeft: 4 }} />
              : <Icon icon={ICONS.delete} size={14} color={COLORS.warning} style={{ marginLeft: 4 }} />
            }
          </View>
          <Text size={12} color={COLORS.textQuaternary} style={{ opacity: 0.7 }}>
            Ideal: {idealMin}–{idealMax} {unit}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Bottom Sheet Modal ── */}
      <Modal
        visible={sheetOpen}
        onClose={saveAndClose}
        showCloseButton={false}
        overlayStyle={inner.overlay}
        containerStyle={inner.modalContainer}
      >
        <Animated.View style={[inner.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={inner.handle} />

          {/* Header del sheet */}
          <View style={inner.sheetHeader}>
            <Button variant="danger" onPress={cancelSheet}>Cancelar</Button>

            <View style={{ alignItems: 'center' }}>
              <Title level={5} color={COLORS.textPrimary} align="center">
                {title}
              </Title>
              <Text size={12} color={COLORS.textQuaternary} align="center">
                Ideal: {idealMin}–{idealMax} {unit}
              </Text>
            </View>

            <Button variant="primary" onPress={saveAndClose}>Listo</Button>
          </View>

          {/* Indicador de rango */}
          <View style={inner.sheetRangeRow}>
            <View style={[inner.rangeDot, { backgroundColor: sheetOk ? COLORS.success : COLORS.warning }]} />
            <Text size={12} color={sheetOk ? COLORS.success : COLORS.warning} style={{ fontWeight: '600' }}>
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
              color={sheetOk ? COLORS.success : COLORS.primary}
            />
          )}

          <View style={{ height: 24 }} />
        </Animated.View>
      </Modal>
    </>
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
  overlay: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    padding: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    width: '100%',
    padding: 0,
    backgroundColor: 'transparent',
  },
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
    width:                '100%',
    backgroundColor:      COLORS.white,
    borderTopLeftRadius:   20,
    borderTopRightRadius:  20,
    paddingHorizontal:     20,
    paddingTop:            12,
    shadowColor:           COLORS.black,
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
