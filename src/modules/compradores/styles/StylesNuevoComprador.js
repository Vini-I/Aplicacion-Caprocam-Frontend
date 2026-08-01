/**
 * ============================================================
 * STYLES: STYLESNUEVOCOMPRADOR
 * ============================================================
 * Módulo: Compradores
 *
 * Estilos de NuevoCompradorScreen.jsx.
 *
 * FUNCIONALIDAD:
 * 1. ICON_SIZES: tamaños de íconos usados en la pantalla (volver,
 *    guardar).
 * 2. styles: layout del formulario, inputError (borde rojo por
 *    campo) y saveButton.
 *
 * IMPORTANTE:
 * - inputError solo se activa vía errorX && styles.inputError,
 *   nunca antes del primer intento de guardar.
 * - saveButton no debe llevar backgroundColor: el fondo blanco y
 *   el borde celeste los pone Button variant="outline".
 * ============================================================
 */



import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const ICON_SIZES = {
  back: 27,
  save: 20,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  navbar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  navbarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    flex: 1,
  },
  backBtn: {
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  navbarPlaceholder: {
    width: 32, height: 32
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16, paddingBottom: 32
  },
  card: {
    borderRadius: 18,
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
    marginBottom: 14
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
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  inputError: {
  borderColor: COLORS.error,
  },


  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.error,
  },
  
  saveButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
  },
  saveButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  alertBox: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  alertText: {
    textAlign: "center",
    width: "100%",
  },
});