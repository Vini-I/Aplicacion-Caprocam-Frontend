/**
 * ============================================================
 * COMPONENTE: WorkerSearchBar
 * ============================================================
 *
 * Campo de búsqueda para filtrar trabajadores por nombre.
 * Incluye un ícono de filtro a la derecha, dentro del mismo componente.
 */

import { View } from 'react-native';

import Input from '../../../shared/components/Input';
import Icon from '../../../shared/components/Icons';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import styles from '../styles/workerSearchBarStyles';

export default function WorkerSearchBar({
  value = '',
  onChangeText,
  placeholder = '',
  editable = true,
  containerStyle,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        containerStyle={styles.inputContainer}
        style={styles.input}
      />
      <View style={styles.iconWrap}>
        <Icon icon={ICONS.filter} size={16} color={COLORS.textTertiary} />
      </View>
    </View>
  );
}
