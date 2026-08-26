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

  // ── Contenedor relativo para superponer el botón "ojito" ──────
  passwordWrapper: {
    position: 'relative',
  },

  // El Input ocupa todo el ancho; paddingRight da espacio al botón del ojo
  passwordInput: {
    marginBottom: 0,
  },

  // Padding interno del TextInput para que el texto no quede bajo el ojo
  passwordFieldInput: {
    paddingRight: 44,
  },

  // Botón del ojo, posicionado en la esquina inferior-derecha del input
  eyeButton: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;