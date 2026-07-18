/**
 * ============================================================
 * ESTILOS: webLoginStyles
 * ============================================================
 * 
 * Responsabilidad: Definición de estilos para la pantalla de inicio
 * de sesión Web (WebLoginScreen) en el módulo de Login.
 * 
 * FUNCIONALIDAD:
 * - Define el fondo de la pantalla y la alineación central del formulario.
 * - Estructura el espaciado del formulario y el contenedor de alertas.
 * 
 * DEPENDENCIAS:
 * - COLORS de theme/colors.js.
 */
import { StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  errorField: {
    borderColor: COLORS.error,
  },

  alertSpacing: {
    marginBottom: 12,
  },
});

export default styles;