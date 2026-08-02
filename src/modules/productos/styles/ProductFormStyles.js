/**
 * ============================================================
 * STYLES: PRODUCTFORMSTYLES
 * ============================================================
 * Módulo: Productos
 *
 * Estilos del formulario de alta/edición de producto
 * (ProductForm.jsx).
 *
 * FUNCIONALIDAD:
 * 1. Layout del navbar, la tarjeta del formulario y cada campo
 *    (input, select, numberInput).
 * 2. inputError: borde rojo que se combina con input/select/
 *    numberInput cuando el campo es inválido tras intentar guardar.
 * 3. saveButton/saveButtonText: botón outline (celeste) de guardar;
 *    saveButtonDisabled solo baja la opacidad, no cambia colores.
 * 4. validationText: mensaje general de error debajo del botón.
 *
 * IMPORTANTE:
 * - saveButton NO debe tener backgroundColor: el fondo blanco y el
 *   borde celeste los pone Button variant="outline" en el JSX.
 * ============================================================
 */


import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";


export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
    borderBottomColor: COLORS.primary,
  },

  navbarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: undefined,
  },

  backBtn: {
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },

  navbarPlaceholder: {
    width: 32,
    height: 32,
  },
  content: { paddingBottom: 32 },
  card: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: undefined,   // ← anula cualquier peso interno del Card
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontWeight: undefined,   // ← agrega esto para anular el fontWeight interno
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
  },
  numberInput: {
    borderRadius: 12,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  select: {
    minHeight: 48,
    borderRadius: 12,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
  },

  inputError: {
    borderColor: COLORS.error,
  },
  saveButton: {
  marginTop: 10,
  borderRadius: 14,
  paddingVertical: 14,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  alertBox: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});