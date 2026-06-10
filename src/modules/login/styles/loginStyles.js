/**
 * ============================================================
 * ESTILOS: LoginScreen
 * ============================================================
 *
 * Estilos exclusivos de la pantalla LoginScreen.
 * Los estilos de ShiftButton y WorkerCard viven en sus
 * propios archivos de componente.
 *
 * USO:
 * import styles from '../styles/loginStyles';
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

const styles = StyleSheet.create({
  // CONTENEDOR PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // HEADER (Empresa + Fecha)
  header: {
    backgroundColor: COLORS.header,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    alignItems: 'center',
  },

  date: {
    marginTop: 8,
  },

  // SECCIONES
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  // TURNOS
  shiftsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  // BOTON PRINCIPAL
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  startButtonWrapper: {
    opacity: 1,
  },

  // MENSAJE DE VALIDACIÓN
  validationContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
});

export default styles;