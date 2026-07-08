/**
 * ============================================================
 * ESTILOS NUEVO PROVEEDOR
 * ============================================================
 *
 * Estilos de la pantalla NuevoProveedorScreen.
 *
 * FUNCIONALIDAD:
 * 1. Colores y tipografia salen de theme/colors y theme/typography, sin
 *    valores hardcodeados.
 * 
 * 2. El card no define ancho ni centrado propio: eso lo resuelve
 *    STYLE.contentWrapper (theme/style) en la screen. El padding raíz
 *    y el fondo blanco tampoco se definen aquí: la screen aplica
 *    STYLE.container (theme/style) directamente como View raíz.
 * 
 * 3. inputError (borde rojo) es el único estilo de estado de campo y
 *    solo debe aplicarse tras un intento de guardado fallido, nunca
 *    mientras el usuario escribe. No se pinta mensaje ni icono
 *    individual debajo del campo.
 * 
 * 4. alertBox vive arriba del boton "Guardar proveedor".
 *
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
  select: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },
  selectOption: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  selectText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
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
    color: COLORS.primary,
    fontWeight: "700",
    fontFamily: TYPOGRAPHY.fontFamily.bold,
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
  alertBox: {
    marginTop: 4,
    marginBottom: 10,
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