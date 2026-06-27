/**
 * ESTILOS: WebRegisterScreen
 *
 * Solo lo exclusivo de esta pantalla. Header, Separator y
 * error de campo viven en sus componentes compartidos.
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  formSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  serverErrorContainer: {
    backgroundColor: COLORS.errorLight,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },

  // Modal de éxito del registro
  modalTitle: {
    marginBottom: 12,
  },

  modalBody: {
    lineHeight: 22,
  },
});

export default styles;