import Text from '../../../shared/components/Text';
import Button from '../../../shared/components/Button';
import { COLORS } from '../../../theme/colors';
import { styles } from '../styles/RegistroStyles';

/**
 * ============================================================
 * COMPONENTE CHIP
 * ============================================================
 *
 * Botón tipo "pastilla" para selección única (finca, estanque,
 * filtros, etc.). Se resalta cuando selected=true.
 *
 * ---
 * PROPS
 * ---
 * label     string  — texto a mostrar dentro del chip
 * selected  boolean — si está activo
 * onPress   fn      — handler al tocar el chip
 *
 * ---
 * EJEMPLO DE USO
 * ---
 * <Chip
 *   label="Finca El Pacífico"
 *   selected={fincaSeleccionada === 1}
 *   onPress={() => handleFinca(1)}
 * />
 */

export default function Chip({ label, selected, onPress }) {
  return (
    <Button
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text
        size={13}
        weight={selected ? '600' : '400'}
        color={selected ? COLORS.primary : COLORS.textTertiary}
      >
        {label}
      </Text>
    </Button>
  );
}