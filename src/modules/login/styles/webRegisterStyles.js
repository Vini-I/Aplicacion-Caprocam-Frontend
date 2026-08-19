/**
 * ESTILOS: webRegisterStyles
 * Estilos para la pantalla de registro de usuarios Web (WebRegisterScreen).
 *
 * @dependencies - COLORS de theme/colors.js
 * @validations  - Alineación central y maquetación responsiva del formulario.
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

  // Modal de éxito del registro
  modalContainer: {
    padding: 24,
  },

  modalInner: {
    alignItems: "center",
    paddingVertical: 10,
  },

  modalIconBadge: {
    marginBottom: 16,
    backgroundColor: COLORS.successLight,
    padding: 12,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
  },

  modalTitle: {
    marginBottom: 12,
  },

  modalBody: {
    lineHeight: 22,
  },

  modalButton: {
    width: "100%",
    marginTop: 24,
    borderColor: COLORS.primary,
  },

  modalButtonText: {
    color: COLORS.primary,
  },
});

export default styles;