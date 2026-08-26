/**
 * EditarProveedorStyles.js
 * Estilos para la pantalla de edición de proveedores.
 *
 * FUNCIONALIDAD:
 * - Proporciona el sistema visual para el formulario de edición.
 * - Define el inputError (borde rojo) que se activa tras un error.
 * - Estiliza el campo deshabilitado (nombre) con un fondo gris tenue.
 * - Mantiene el botón de guardado consistente con el diseño general.
 *
 * REGLAS IMPORTANTES:
 * - Los estilos de alerta (success/danger) se manejan por variantes.
 * - Los campos comparten borderRadius y alturas idénticas al diseño.
 * - El color de inputError solo es visible cuando existe un error.
 *
 * @dependencies - StyleSheet, COLORS, TYPOGRAPHY, theme/style
 * @validations - N/A
 * @navigation - N/A
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  scrollContainer: {
    paddingBottom: 24,
  },

  spinner: {
    marginTop: 40,
  },

  card: {
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 19,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.black,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.black,
    marginBottom: 6,
  },

  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  inputDisabled: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },

  select: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },

  saveButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  saveButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.primary,
  },

  inputError: {
    borderColor: COLORS.error,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  alertContainer: {
    marginTop: 4,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  alertText: {
    textAlign: "center",
    width: "100%",
  },
  alertSuccess: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
});

export const ICON_STYLES = {
  save: {
    color: COLORS.primary,
  },
  subtitle: {
    color: COLORS.primary,
  },
};