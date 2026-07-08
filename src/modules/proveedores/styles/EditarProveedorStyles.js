/**
 * ============================================================
 * ESTILOS EDITAR PROVEEDOR
 * ============================================================
 *
 * Estilos de la pantalla EditarProveedorScreen.
 *
 * FUNCIONALIDAD:
 * 1. Colores y tipografia salen de theme/colors y theme/typography.
 * 
 * 2. El card no define ancho/centrado propio, eso lo resuelve
 *    STYLE.contentWrapper (theme/style) desde la screen. El padding
 *    raíz tampoco se define aquí: la screen aplica STYLE.container
 *    (theme/style) como View raíz, igual que en NuevoProveedorScreen,
 *    para que ambas pantallas se centren con exactamente las mismas
 *    medidas. 
 * 
 * 3. input/select/saveButton se mantienen alineados con
 *    NuevoProveedorStyles (borde redondeado, mismo radio) para que
 *    Nuevo/Editar proveedor se vean como el mismo formulario.
 * 
 * 4. inputError (borde rojo) es el único estilo de estado de campo y
 *    solo debe aplicarse tras un intento de guardado fallido, nunca
 *    mientras el usuario escribe. No se pinta mensaje ni icono
 *    individual debajo del campo.
 * 
 * 5. alertContaine` vive arriba del boton "Guardar proveedor".
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