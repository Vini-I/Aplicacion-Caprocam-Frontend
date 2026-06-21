/**
 * ============================================================
 * COMPONENTE MODULOCARD
 * ============================================================
 *
 * Tarjeta de la grilla de Registro que representa un módulo. Si
 * no recibe onPress, se muestra deshabilitada con la leyenda
 * "Próximamente".
 *
 * ---
 * PROPS
 * ---
 * modulo   object             — item de MODULOS: { id, label, descripcion, icono, color }
 * onPress  fn|null|undefined  — handler al tocar la tarjeta. Si es
 *                                null/undefined, la tarjeta queda
 *                                deshabilitada y no interactiva
 *
 * ---
 * EJEMPLO DE USO
 * ---
 * // Módulo disponible
 * <ModuloCard
 *   modulo={{ id: 'mortalidad', label: 'Mortalidad', descripcion: '...', icono: 'report', color: COLORS.warning }}
 *   onPress={() => abrirModulo('mortalidad')}
 * />
 *
 * // Módulo "Próximamente"
 * <ModuloCard modulo={modulo} onPress={null} />
 */

import { View } from 'react-native';
import Button from '../../../shared/components/Button';
import Text from '../../../shared/components/Text';
import Icon from '../../../shared/components/Icons';
import { ICONS } from '../../../theme/icons';
import { COLORS } from '../../../theme/colors';
import { styles } from '../styles/RegistroStyles';

export default function ModuloCard({ modulo, onPress }) {
  const disponible = onPress !== null && onPress !== undefined;

  return (
    <Button
      onPress={onPress}
      disabled={!disponible}
      style={styles.moduloCard}
    >
      <View style={[
        styles.moduloIcono,
        { backgroundColor: disponible ? modulo.color : COLORS.textQuaternary },
      ]}>
        <Icon icon={ICONS[modulo.icono]} size={22} color={COLORS.white} />
      </View>

      <Text size={14} weight="600" color={disponible ? COLORS.textSecondary : COLORS.textQuaternary} style={styles.moduloLabel}>
        {modulo.label}
      </Text>

      <Text size={12} color={COLORS.textTertiary} style={styles.moduloDesc}>
        {modulo.descripcion}
      </Text>

      <Text size={12} color={disponible ? COLORS.primary : COLORS.textQuaternary}>
        {disponible ? 'Toca para registrar →' : 'Próximamente'}
      </Text>
    </Button>
  );
}