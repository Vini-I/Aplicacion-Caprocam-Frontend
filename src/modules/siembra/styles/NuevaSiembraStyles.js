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
 * - Alert de validación/confirmación (centrado, arriba del botón guardar).
 
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
  requiredLabel: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: COLORS.error,
    borderRadius: 8,
  },
  createButton: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 20,
  },
  createButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  createButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  alert: {
    width: "100%",
    marginBottom: 16,
  },
  alertSuccess: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
});
