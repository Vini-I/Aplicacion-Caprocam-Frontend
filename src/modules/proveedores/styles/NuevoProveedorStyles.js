/**
 * NuevoProveedorStyles.js
 * Estilos para la pantalla de creación de proveedores.
 *
 * FUNCIONALIDAD:
 * - Define toda la estructura visual del formulario de creación.
 * - Incluye los estilos para el Select, Inputs y Alertas.
 * - Gestiona el espaciado vertical entre campos (gap/marginBottom).
 * - Aplica sombras suaves y bordes redondeados al contenedor (Card).
 *
 * REGLAS IMPORTANTES:
 * - Totalmente sincronizado con EditarProveedorStyles en medidas.
 * - Los errores visuales (inputError) son bordes rojos únicamente.
 * - Las fuentes se obtienen exclusivamente de TYPOGRAPHY.
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