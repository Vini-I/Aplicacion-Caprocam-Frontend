/**
 * ============================================================
 * ESTILOS NUEVA SIEMBRA
 * ============================================================
 *
 * Define los estilos utilizados en la pantalla de creación
 * de una nueva siembra.
 *
 * Incluye:
 * - Contenedor del formulario.
 * - Botón de creación.
 * - Mensajes del modal de validación.
 *
 * Mantiene la identidad visual mediante estilos globales.
 */
import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 28,
    paddingBottom: 40,
  },
  fieldContainer: {
  marginBottom: 14,
},
  createButton: {
    height: 56,
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 20,
  },
  createButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  modalTitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 8,
  },
  modalMessage: {
    color: COLORS.textTertiary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});
