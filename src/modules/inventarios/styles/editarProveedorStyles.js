/**
 * Estilos para la pantalla de edición de proveedor
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  //Contenedor principal de la pantalla
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  // Estilos para la barra de navegación
  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },

  // Estilos para el título en la barra de navegación
  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },

  navbarPlaceholder: {
    width: 32,
    height: 32,
  },

  //Cotenedor del scroll
  content: {
    padding: 16,
    paddingBottom: 32,
  },

  // Estilos para la tarjeta que contiene el formulario
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

  //Espaciado entre campos del formulario
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
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  select: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },

  // Estilos para el botón de guardar cambios
  saveButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
  },

  // Estilos para el texto del botón de guardar
  saveButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.white,
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.error,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});
