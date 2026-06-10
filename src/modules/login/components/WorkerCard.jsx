/**
 * ============================================================
 * COMPONENTE: WorkerCard
 * ============================================================
 *
 * Tarjeta individual para seleccionar un trabajador.
 * Muestra avatar, nombre, rol e indicador de selección.
 *
 * Props:
 * - worker: objeto del trabajador (id, name, initials, role)
 * - isSelected: boolean - ¿está seleccionado?
 * - onPress: función a ejecutar al presionar
 *
 * Ejemplo:
 * <WorkerCard
 *   worker={workers[0]}
 *   isSelected={selectedWorker === workers[0].id}
 *   onPress={() => handleSelectWorker(workers[0].id)}
 * />
 */

import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Avatar from '../../../shared/components/Avatar';
import { COLORS } from '../../../theme/colors';

export function WorkerCard({ worker, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.wrapper, isSelected && styles.wrapperSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* AVATAR CON INICIALES */}
        <Avatar
          name={worker.initials}
          size={48}
          bgColor={COLORS.avatar.background}
          fgColor={COLORS.avatar.foreground}
        />

        {/* NOMBRE Y ROL */}
        <View style={styles.info}>
          <Text style={styles.name}>{worker.name}</Text>
          <Text style={styles.role}>{worker.role}</Text>
        </View>

        {/* INDICADOR DE SELECCIÓN */}
        {isSelected && (
          <View style={styles.checkIcon}>
            <Text style={styles.checkIconText}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  wrapperSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 4,
  },

  role: {
    fontSize: 13,
    color: COLORS.text.medium,
  },

  checkIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkIconText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
