/**
 * ESTILOS: webLoginStyles
 * Estilos para la pantalla de inicio de sesión Web (WebLoginScreen).
 *
 * @dependencies - COLORS y STYLE de theme/
 * @validations  - Define el fondo de la pantalla y la alineación central del formulario.
 * @navigation   - N/A (archivo de estilos).
 */
import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },

  errorField: {
    borderColor: COLORS.error,
  },

  alertSpacing: {
    marginBottom: 12,
  },

  serverAlertSpacing: {
    marginBottom: 16,
  },
});

export default styles;