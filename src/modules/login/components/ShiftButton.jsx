/**
 * ============================================================
 * COMPONENTE: ShiftButton
 * ============================================================
 *
 * Botón individual para seleccionar un turno.
 *
 * Props:
 * - shift: objeto del turno (id, label, icon, timeRange, backgroundColor)
 * - isSelected: boolean - ¿está seleccionado?
 * - onPress: función a ejecutar al presionar
 *
 * Ejemplo:
 * <ShiftButton
 *   shift={SHIFTS[0]}
 *   isSelected={selectedShift === SHIFTS[0].id}
 *   onPress={() => handleSelectShift(SHIFTS[0].id)}
 * />
 */

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Avatar from '../../../shared/components/Avatar';
import { COLORS } from '../../../theme/colors';

export function ShiftButton({ shift, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected && [styles.buttonSelected, { backgroundColor: shift.backgroundColor }],
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Avatar source={shift.icon} />

      <Text style={styles.buttonText}>{shift.label}</Text>
      <Text style={styles.buttonTime}>{shift.timeRange}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonSelected: {
    borderWidth: 2,
    borderColor: COLORS.text.dark,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 4,
    marginTop: 8,
  },

  buttonTime: {
    fontSize: 10,
    color: COLORS.text.medium,
  },
});
