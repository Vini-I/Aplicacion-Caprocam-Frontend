/**
 * ============================================================
 * COMPONENTE: WorkerSearchBar
 * ============================================================
 *
 * Campo de búsqueda para filtrar trabajadores por nombre.
 */

import { View, StyleSheet } from 'react-native';

import Input from '../../../shared/components/Input';
import Icon from '../../../shared/components/Icons';

import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';

export default function WorkerSearchBar({
  value = '',
  onChangeText,
  placeholder = '',
  editable = true,
  containerStyle,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Icon icon={ICONS.filter} size={16} color={COLORS.textTertiary} style={styles.icon} />
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        containerStyle={styles.inputContainer}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    borderWidth: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    outlineStyle: 'none',
  },
});