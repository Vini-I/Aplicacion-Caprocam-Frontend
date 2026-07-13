/**
 * ============================================================
 * ESTILOS: webRegisterStyles
 * ============================================================
 * 
 * Responsabilidad: Definición de estilos para la pantalla de registro
 * de usuarios Web (WebRegisterScreen) en el módulo de Login.
 * 
 * FUNCIONALIDAD:
 * - Define el fondo de la pantalla y la alineación central del formulario.
 * - Estructura el espaciado para el contenedor de errores del servidor y
 *   los elementos de texto dentro del modal de éxito.
 * 
 * DEPENDENCIAS:
 * - COLORS de theme/colors.js.
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