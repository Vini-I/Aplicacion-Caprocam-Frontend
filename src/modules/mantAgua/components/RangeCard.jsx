/**
 * ============================================================
 * COMPONENTE RangeCard
 * ============================================================
 *
 * Descripción:
 * Tarjeta para registrar mediciones numéricas (pH, temperatura,
 * oxígeno, salinidad) utilizando barras de rango dinámicas y botones
 * de paso (- / +) con soporte de avance continuo (hold) e incremento de 0.1 por defecto.
 *
 * @dependencies RangeTrack, StepHoldButton, useRangeCard, RangeCardStyles
 * @validations Evaluación contra rangos ideales (óptimo, alerta, peligro) y clamping min/max.
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
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
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
// (rojo / amarillo / verde / amarillo / gris) y los ticks a mostrar
// debajo. Es solo cálculo de presentación; no altera idealMin/idealMax
// ni el valor de las lecturas.
function calcularZonas({ idealMin, idealMax, sliderMin, sliderMax, tieneMaxIdeal }) {
  const totalRango = sliderMax - sliderMin || 1;
  const toPct = (v) => (v - sliderMin) / totalRango;

  if (!tieneMaxIdeal) {
    const buffer = (idealMin - sliderMin) * 0.35;
    const warnLow = Math.min(Math.max(idealMin - buffer, sliderMin), idealMin);

    return {
      warnLow,
      warnHigh: null,
      zones: [
        { left: 0, width: toPct(warnLow), color: COLORS.error },
        { left: toPct(warnLow), width: toPct(idealMin) - toPct(warnLow), color: COLORS.warning },
        { left: toPct(idealMin), width: 1 - toPct(idealMin), color: COLORS.success },
      ],
      ticks: [
        { pct: 0, label: sliderMin },
        { pct: toPct(warnLow), label: Number(warnLow.toFixed(1)) },
        { pct: toPct(idealMin), label: idealMin },
        { pct: 1, label: sliderMax },
      ],
    };
  }

  const bufferBase = Math.max((idealMax - idealMin) * 0.35, totalRango * 0.05);
  const warnLow = Math.max(idealMin - bufferBase, sliderMin);
  const warnHigh = Math.min(idealMax + bufferBase, sliderMax);

  return {
    warnLow,
    warnHigh,
    zones: [
      { left: 0, width: toPct(warnLow), color: COLORS.error },
      { left: toPct(warnLow), width: toPct(idealMin) - toPct(warnLow), color: COLORS.warning },
      { left: toPct(idealMin), width: toPct(idealMax) - toPct(idealMin), color: COLORS.success },
      { left: toPct(idealMax), width: toPct(warnHigh) - toPct(idealMax), color: COLORS.warning },
      { left: toPct(warnHigh), width: 1 - toPct(warnHigh), color: COLORS.textQuaternary },
    ],
    ticks: [
      { pct: 0, label: sliderMin },
      { pct: toPct(warnLow), label: Number(warnLow.toFixed(1)) },
      { pct: toPct(idealMin), label: idealMin },
      { pct: toPct(idealMax), label: idealMax },
      { pct: toPct(warnHigh), label: Number(warnHigh.toFixed(1)) },
      { pct: 1, label: sliderMax },
    ],
  };
}

// Determina el color (rojo/amarillo/verde/gris) que le corresponde a
// un valor puntual según las zonas calculadas arriba.
function colorPorValor(value, { idealMin, idealMax, warnLow, warnHigh, tieneMaxIdeal }) {
  if (tieneMaxIdeal) {
    if (value >= idealMin && value <= idealMax) return COLORS.success;
    if (value > idealMax) return value <= warnHigh ? COLORS.warning : COLORS.textQuaternary;
    return value >= warnLow ? COLORS.warning : COLORS.error;
  }
  if (value >= idealMin) return COLORS.success;
  return value >= warnLow ? COLORS.warning : COLORS.error;
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

        return (
          <View key={r.id} style={inner.readingRow}>
            <View style={inner.labelWrap}>
              {(() => {
                const lbl = ETIQUETAS[idx] ?? { type: 'text', value: `${idx + 1}` };
                return (
                  <>
                    <View style={inner.labelCircle}>
                      {lbl.type === 'icon' ? (
                        <Icon icon={lbl.icon} size={15} color={COLORS.primary} />
                      ) : (
                        <Text size={13} color={COLORS.primary}>{lbl.value}</Text>
                      )}
                    </View>
                    {lbl.texto && (
                      <Text size={10} color={COLORS.textTertiary} style={inner.labelText}>{lbl.texto}</Text>
                    )}
                  </>
                );
              })()}
            </View>

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

            <View style={inner.rightValueWrap}>
              <Text size={14} color={colorValor} style={inner.rightValue}>
                {r.value.toFixed(decimals)} {unit}
              </Text>
            </View>

            {puedeMostrarAgregar && (
              <Button onPress={intentarAgregar} style={[inner.stepBtn, inner.stepBtnIdle]}>
                <Icon icon={ICONS.add} size={16} color={COLORS.white} />
              </Button>
            )}

            <Button variant='ghost' onPress={() => eliminarLectura(r.id)} style={inner.iconBtn}>
              <Icon icon={ICONS.delete} size={20} color={COLORS.error} />
            </Button>
          </View>
        );
      })}

      {lecturas.length === 0 && (
        <Button variant="outline" onPress={intentarAgregar}>
          + Agregar medición
        </Button>
      )}
    </View>
  );
}