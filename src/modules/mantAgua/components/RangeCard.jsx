import React from 'react';
import { View, TextInput} from 'react-native';
import ProgressBar from '../../../shared/components/ProgressBar';
import Button from '../../../shared/components/Button';
import Text from '../../../shared/components/Text';
import Title from '../../../shared/components/Title';
import Icon from '../../../shared/components/Icons';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import useRangeCard from '../hooks/useRangeCard';
import { cardStyles as s, innerStyles as inner } from '../styles/RangeCardStyles';


/**
 * ============================================================
 * COMPONENTE RANGECARD
 * ============================================================
 *
 * Tarjeta para registrar mediciones numéricas (pH, temperatura,
 * oxígeno, salinidad, etc.) con controles de incremento,
 * decremento y entrada manual del valor.
 *
 * Permite:
 * - Mostrar una etiqueta y una unidad de medida
 * - Registrar una o varias mediciones (hasta maxReadings)
 * - Marcar si el valor está dentro del rango ideal
 * - Mostrar una barra de progreso por cada lectura
 * - Trabajar con un rango ideal completo (idealMin + idealMax)
 *   o con un mínimo único (solo idealMin)
 *
 * La lógica de estado vive en el hook useRangeCard(); este
 * archivo solo arma el JSX.
 *
 * ---
 * PROPS
 * ---
 * title          string   — Texto del encabezado. Ej: "pH"
 * unit           string   — Unidad de medida. Ej: "mg/L"
 * icon           JSX      — Componente <Icon /> ya instanciado.
 *                            Ej: icon={<Icon icon={ICONS.chemicalContainer} color={COLORS.primary} size={18} />}
 * idealMin       number   — Límite inferior del rango ideal
 * idealMax       number?  — Límite superior. Si se omite, idealMin
 *                            funciona como mínimo recomendado
 * sliderMin      number   — Valor mínimo permitido al editar
 * sliderMax      number   — Valor máximo permitido al editar
 * step           number   — Incremento/decremento de los botones +/-. Default: 0.1
 * decimals       number   — Decimales a mostrar/redondear. Default: 1
 * maxReadings    number   — Tope de lecturas que se pueden agregar. Default: 4
 * showRangeColor boolean  — Si false, nunca pinta de verde aunque esté en rango. Default: true
 * labelStyle     string   — "numeric" (①②③) o "daynight" (sol/luna). Default: "numeric"
 * badgeLabel     string?  — Texto del badge superior derecho. Si no se pasa,
 *                            se autogenera con idealMin/idealMax
 * onChange       fn?      — (readings) => void, se llama con el arreglo
 *                            completo de lecturas en cada cambio
 *
 * ============================================================
 * EJEMPLOS DE USO
 * ============================================================
 *
 * // Rango completo (min y max), 2 lecturas día/noche
 * <RangeCard
 *   title="pH"
 *   unit="pH"
 *   icon={<Icon icon={ICONS.chemicalContainer} color={COLORS.primary} size={18} />}
 *   idealMin={7.5}
 *   idealMax={8.5}
 *   sliderMin={4}
 *   sliderMax={10}
 *   step={0.1}
 *   decimals={1}
 *   maxReadings={2}
 *   labelStyle="daynight"
 *   onChange={(lecturas) => setPhReadings(lecturas)}
 * />
 *
 * // Solo mínimo recomendado (sin idealMax), hasta 5 lecturas numeradas
 * <RangeCard
 *   title="Oxígeno Disuelto"
 *   unit="mg/L"
 *   icon={<Icon icon={ICONS.water} color={COLORS.primary} size={18} />}
 *   idealMin={5}
 *   sliderMin={0}
 *   sliderMax={20}
 *   maxReadings={5}
 *   labelStyle="numeric"
 *   onChange={(lecturas) => setOxReadings(lecturas)}
 * />
 */

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
  showRangeColor = true,
  labelStyle = 'numeric',
  badgeLabel,
  onChange,
}) {
  const {
    readings,
    addReading,
    removeReading,
    normalize,
    hasUpperIdeal,
    globalProgress,
    allOk,
    getReadingHandlers,
  } = useRangeCard({ idealMin, idealMax, sliderMin, sliderMax, step, decimals, maxReadings, onChange });

  const barColor = allOk ? COLORS.success : globalProgress > 0 ? COLORS.warning : COLORS.secondary;
  const LABELS = labelStyle === 'daynight' ? LABELS_DAYNIGHT : LABELS_NUMERIC;

  const resolvedBadge = badgeLabel ?? (
    hasUpperIdeal
      ? `Ideal: ${idealMin}–${idealMax} ${unit}`
      : `Min ${idealMin} ${unit}`
  );

  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={s.cardHeaderLeft}>
          {icon}
          <Title level={5} color={COLORS.textPrimary}>{title}</Title>
          <Text size={13} color={COLORS.textTertiary}>({unit})</Text>
        </View>
        <Text size={12} color={COLORS.primary}>{resolvedBadge}</Text>
      </View>

      {readings.map((r, idx) => {
        const inRange = r.value >= idealMin && r.value <= idealMax;
        const inMinRange = r.value >= idealMin;
        const showGreen = showRangeColor && (hasUpperIdeal ? inRange : inMinRange);
        const readingProgress = Math.min(Math.max(normalize(r.value), 0), 1);
        const miniBarColor = showGreen ? COLORS.success : COLORS.primary;
        const { decrement, increment, handleChangeText, handleFocus, handleBlur } = getReadingHandlers(r);

        return (
          <View key={r.id} style={inner.readingRow}>
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

            <Button
              onPress={decrement}
              style={[inner.stepBtn, inner.stepBtnIdle]}
            >
              <Text size={22} color={COLORS.white} style={{ lineHeight: 26 }}>−</Text>
            </Button>

            <View style={{ flex: 1 }}>
              <View style={inner.valueRow}>
                <TextInput
                  value={r.editing ? r.rawInput : r.value.toFixed(decimals)}
                  onChangeText={handleChangeText}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                  style={[
                    inner.valueInput,
                    {
                      color: showGreen ? COLORS.success : COLORS.primary,
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
              <ProgressBar showLabel={false} progress={Math.round(readingProgress * 100)} color={miniBarColor} />
            </View>

            <Button
              onPress={increment}
              style={[inner.stepBtn, inner.stepBtnIdle]}
            >
              <Text size={20} color={COLORS.white} style={{ lineHeight: 26 }}>+</Text>
            </Button>

            {readings.length > 1 ? (
              <Button
                onPress={() => removeReading(r.id)}
                style={{ backgroundColor: 'transparent', padding: 0, marginTop: 0, marginLeft: 2 }}
              >
                <Icon icon={ICONS.delete} size={20} color={COLORS.textQuaternary} />
              </Button>
            ) : (
              <View style={{ width: 22, marginLeft: 2 }} />
            )}
          </View>
        );
      })}

      {readings.length < maxReadings && (
        <Button variant="primary" onPress={addReading}>+ Agregar medición</Button>
      )}
    </View>
  );
}