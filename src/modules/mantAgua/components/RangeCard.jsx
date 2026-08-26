/**
 * ============================================================
 * COMPONENTE RangeCard
 * ============================================================
 *
 * Descripción:
 * Tarjeta para registrar mediciones numéricas (pH, temperatura,
 * oxígeno, salinidad) utilizando barras de rango dinámicas, botones
 * de paso (- / +) con soporte de avance continuo (hold), diseño en 2 filas
 * responsivo para móviles y opción de eliminación en todas las lecturas.
 *
 * @dependencies RangeTrack, StepHoldButton, useRangeCard, RangeCardStyles
 * @validations Evaluación contra rangos ideales (óptimo, alerta, peligro), clamping min/max y eliminación de lecturas.
 * @navigation N/A
 *
 * La lógica de estado vive en el hook useRangeCard(); este
 * archivo solo arma el JSX e integra los controles táctiles de paso.
 * Admite `containerStyle` para personalizar el contenedor desde quien lo usa.
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
 * step           number   — Paso usado por useRangeCard() para redondeo interno. Default: 0.1
 * decimals       number   — Decimales a mostrar/redondear. Default: 1
 * maxLecturas    number   — Tope de lecturas que se pueden agregar. Default: 4
 * showRangeColor boolean  — Si false, nunca pinta de verde aunque esté en rango. Default: true
 * labelStyle     string   — "numeric" (①②③) o "daynight" (sol/luna). Default: "numeric"
 * badgeLabel     string?  — Texto del badge superior derecho. Si no se pasa,
 *                            se autogenera con idealMin/idealMax
 * onChange       fn?      — (lecturas) => void, se llama con el arreglo
 *                            completo de lecturas en cada cambio
 *
 * ---
 * RESTRICCIONES
 * ---
 * - No manejar estado de lecturas aquí; ese estado vive en useRangeCard().
 * - No hardcodear colores; deben venir de COLORS.
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
 *   maxLecturas={2}
 *   labelStyle="daynight"
 *   onChange={(lecturas) => setLecturasPh(lecturas)}
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
 *   maxLecturas={5}
 *   labelStyle="numeric"
 *   onChange={(lecturas) => setLecturasOx(lecturas)}
 * />
 */

import { useRef, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Button from '../../../shared/components/Button';
import Text from '../../../shared/components/Text';
import Title from '../../../shared/components/Title';
import Icon from '../../../shared/components/Icons';
import TimeInput from '../../../shared/components/TimeInput';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import { getCurrentTime12 } from '../../../shared/utils/dateUtils';
import useRangeCard from '../hooks/useRangeCard';
import RangeTrack from './RangeTrack';
import { cardStyles as s, innerStyles as inner } from '../styles/RangeCardStyles';

function StepHoldButton({ icon, onPress, disabled, style }) {
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const stop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePressIn = () => {
    if (disabled) return;
    onPress();
    stop();
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onPress();
      }, 100);
    }, 400);
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPressIn={handlePressIn}
      onPressOut={stop}
      disabled={disabled}
      style={[style, disabled && { opacity: 0.3 }]}
    >
      <Icon icon={icon} size={13} color={COLORS.white} />
    </TouchableOpacity>
  );
}





const ETIQUETAS_DIA_NOCHE = [
  { type: 'icon', icon: ICONS.morningSun, texto: 'Día' },
  { type: 'icon', icon: ICONS.nightSun, texto: 'Noche' },
];
const ETIQUETAS_NUMERICAS = [
  { type: 'text', value: '①' },
  { type: 'text', value: '②' },
  { type: 'text', value: '③' },
  { type: 'text', value: '④' },
  { type: 'text', value: '⑤' },
];

// Calcula, a partir del rango ideal, las zonas de color de la barra
// representando un termómetro (Azul al mínimo, Verde en lo ideal, Rojo al máximo)
// y los ticks a mostrar debajo. Es solo cálculo de presentación.
function calcularZonas({ idealMin, idealMax, sliderMin, sliderMax, tieneMaxIdeal }) {
  const totalRango = sliderMax - sliderMin || 1;
  const toPct = (v) => Math.min(Math.max((v - sliderMin) / totalRango, 0), 1);
  const colorMin = COLORS.primary;
  const colorIdeal = COLORS.success;
  const colorMax = COLORS.error;

  if (!tieneMaxIdeal) {
    const leftWidth = toPct(idealMin);
    return {
      warnLow: idealMin,
      warnHigh: null,
      zones: [
        { left: 0, width: leftWidth, color: colorMin },
        { left: leftWidth, width: 1 - leftWidth, color: colorIdeal },
      ],
      ticks: [
        { pct: 0, label: sliderMin },
        { pct: leftWidth, label: idealMin },
        { pct: 1, label: sliderMax },
      ],
    };
  }

  const leftWidth = toPct(idealMin);
  const idealWidth = Math.max(toPct(idealMax) - leftWidth, 0);
  const rightWidth = Math.max(1 - toPct(idealMax), 0);

  return {
    warnLow: idealMin,
    warnHigh: idealMax,
    zones: [
      { left: 0, width: leftWidth, color: colorMin },
      { left: leftWidth, width: idealWidth, color: colorIdeal },
      { left: toPct(idealMax), width: rightWidth, color: colorMax },
    ],
    ticks: [
      { pct: 0, label: sliderMin },
      { pct: leftWidth, label: idealMin },
      { pct: toPct(idealMax), label: idealMax },
      { pct: 1, label: sliderMax },
    ],
  };
}

// Determina el color (Azul / Verde / Rojo) estilo termómetro
// que le corresponde a un valor puntual.
function colorPorValor(value, { idealMin, idealMax, tieneMaxIdeal }) {
  const colorMin = COLORS.primary;
  const colorIdeal = COLORS.success;
  const colorMax = COLORS.error;

  if (tieneMaxIdeal) {
    if (value >= idealMin && value <= idealMax) return colorIdeal;
    if (value > idealMax) return colorMax;
    return colorMin;
  }
  if (value >= idealMin) return colorIdeal;
  return colorMin;
}

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
  maxLecturas = 4,
  showRangeColor = true,
  labelStyle = 'numeric',
  badgeLabel,
  initialValues = [],
  onChange,
  containerStyle,
  puedeAgregar = true,
  onIntentoAgregarBloqueado,
}) {
  // Determine effective maximum readings: day/night cards only allow 2,
  // oxygen (oxígeno) should allow up to 5. Fall back to provided `maxLecturas`.
  const lowerTitle = (title || '').toString().toLowerCase();
  let effectiveMax = maxLecturas;
  if (labelStyle === 'daynight') {
    effectiveMax = 2;
  } else if (
    lowerTitle.includes('ox') ||
    lowerTitle.includes('oxígeno') ||
    lowerTitle.includes('oxigeno') ||
    lowerTitle.includes('oxígeno disuelto') ||
    lowerTitle.includes('oxigeno disuelto')
  ) {
    effectiveMax = Math.max(5, maxLecturas);
  }

  const {
    lecturas,
    agregarLectura,
    eliminarLectura,
    actualizaHora,
    tieneMaxIdeal,
    obtenerManejadores,
  } = useRangeCard({ idealMin, idealMax, sliderMin, sliderMax, step, decimals, maxLecturas: effectiveMax, onChange, initialValues });

  const ETIQUETAS = labelStyle === 'daynight' ? ETIQUETAS_DIA_NOCHE : ETIQUETAS_NUMERICAS;

  const textoBadge = badgeLabel ?? (
    tieneMaxIdeal
      ? `Ideal: ${idealMin}–${idealMax} ${unit}`
      : `Min ${idealMin} ${unit}`
  );

  const zonasInfo = calcularZonas({ idealMin, idealMax, sliderMin, sliderMax, tieneMaxIdeal });

  const intentarAgregar = () => {
    if (!puedeAgregar) {
      onIntentoAgregarBloqueado?.();
      return;
    }
    agregarLectura();
  };

  return (
    <View style={[s.card, containerStyle]}>
      <View style={s.cardHeader}>
        <View style={s.cardHeaderLeft}>
          {icon}
          <Title level={5} color={COLORS.textPrimary}>{title}</Title>
          <Text size={13} color={COLORS.textTertiary}>({unit})</Text>
        </View>
        <Text size={12} color={COLORS.primary}>{textoBadge}</Text>
      </View>

      {lecturas.map((r, idx) => {
        const colorValor = showRangeColor ? colorPorValor(r.value, { idealMin, idealMax, ...zonasInfo, tieneMaxIdeal }) : COLORS.primary;
        const { handleArrastre, decrementar, incrementar } = obtenerManejadores(r);
        const esUltima = idx === lecturas.length - 1;
        const puedeMostrarAgregar = esUltima && lecturas.length > 0 && lecturas.length < effectiveMax;
        const lbl = ETIQUETAS[idx] ?? { type: 'text', value: `${idx + 1}` };

        return (
          <View key={r.id} style={inner.readingItem}>
            {/* Fila 1: Identificación (Día/Noche/Número) + Botones de Acción (+ / Eliminar) */}
            <View style={inner.readingTopRow}>
              <View style={inner.labelWrap}>
                <View style={inner.labelCircle}>
                  {lbl.type === 'icon' ? (
                    <Icon icon={lbl.icon} size={15} color={COLORS.primary} />
                  ) : (
                    <Text size={13} color={COLORS.primary} weight="700">{lbl.value}</Text>
                  )}
                </View>
                {lbl.texto && (
                  <Text size={12} color={COLORS.textPrimary} weight="600" style={inner.labelText}>{lbl.texto}</Text>
                )}
              </View>

              <View style={inner.readingActions}>
                {puedeMostrarAgregar && (
                  <Button onPress={intentarAgregar} style={[inner.stepBtn, inner.stepBtnIdle]}>
                    <Icon icon={ICONS.add} size={16} color={COLORS.white} />
                  </Button>
                )}

                <Button variant='ghost' onPress={() => eliminarLectura(r.id)} style={inner.iconBtn}>
                  <Icon icon={ICONS.delete} size={18} color={COLORS.error} />
                </Button>
              </View>
            </View>

            {/* Fila 2: Hora 12h + Badge de Valor Prominente */}
            <View style={inner.readingDataRow}>
              <TimeInput
                value={r.horaMedicion}
                onChangeText={(newTime12) => actualizaHora(r.id, newTime12)}
                containerStyle={inner.timeInputWrap}
                inputStyle={inner.timeInput}
                textStyle={inner.timeText}
              />

              <View style={[inner.valueBadge, { borderColor: colorValor }]}>
                <Text size={14} color={colorValor} weight="700">
                  {r.value.toFixed(decimals)} {unit}
                </Text>
              </View>
            </View>

            {/* Fila Inferior del Slider: Botón (-) --- Barra de Rango de Ancho Completo --- Botón (+) */}
            <View style={inner.sliderRow}>
              <StepHoldButton
                icon={ICONS.minus}
                onPress={decrementar}
                disabled={r.value <= sliderMin}
                style={inner.stepHoldBtn}
              />

              <RangeTrack
                value={r.value}
                min={sliderMin}
                max={sliderMax}
                decimals={decimals}
                zones={zonasInfo.zones}
                ticks={zonasInfo.ticks}
                badgeColor={colorValor}
                badgeText={r.value.toFixed(decimals)}
                onChange={handleArrastre}
              />

              <StepHoldButton
                icon={ICONS.add}
                onPress={incrementar}
                disabled={r.value >= sliderMax}
                style={inner.stepHoldBtn}
              />
            </View>
          </View>
        );
      })}

      {lecturas.length === 0 && (
        <Button variant="outline" onPress={intentarAgregar}>
          + Agregar Medición
        </Button>
      )}
    </View>
  );
}