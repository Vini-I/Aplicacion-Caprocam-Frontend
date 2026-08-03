/**
 * ============================================================
 * STYLES: EDITARCOMPRADORSTYLES
 * ============================================================
 * Módulo: Compradores
 *
 * Estilos de EditarCompradorScreen.jsx.
 *
 * FUNCIONALIDAD:
 * 1. Layout del formulario, el campo de nombre deshabilitado, los
 *    inputs editables y el botón de guardar.
 * 2. inputError: borde rojo que se combina con "input" cuando
 *    teléfono o correo son inválidos, solo después de intentar
 *    guardar.
 *
 * IMPORTANTE:
 * - saveButton no debe llevar backgroundColor: el fondo blanco y
 *   el borde celeste los pone Button variant="outline".
 * ============================================================
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },

  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "left",
    marginTop: 5,
  },

  navbarPlaceholder: {
    width: 32,
    height: 32,
  },

  content: {
    paddingTop: 40,
    paddingBottom: 40,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
  },

  cardTitle: {
    fontSize: 19,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.textSecondary,
    marginBottom: 16,
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
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  inputDisabled: {
    minHeight: 48,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },

  saveButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
  },

  saveButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.primary,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  inputError: {
   borderColor: COLORS.error,
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.error,
  },

  alertContainer: {
    marginBottom: 16,
  },

  // Solo para esta pantalla: cuando la alerta general es "warning" (campos
  // sin completar), se pinta en rojo en vez del amarillo por defecto de
  // Alert.jsx, sin tocar el componente compartido.
  alertWarningComoError: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
  },
  alertWarningComoErrorTexto: {
    color: COLORS.error,
  },

  loadingContainer: {
    justifyContent: "center",
  },
});

export const ICON_STYLES = {
  exit: {
    size: 26,
    color: COLORS.white,
  },
  save: {
    size: 20,
    color: COLORS.white,
  },
};