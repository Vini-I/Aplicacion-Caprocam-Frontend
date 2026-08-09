/**
 * ESTILOS: EquipoSelectStyles
 * Estilos locales del selector desplegable usado en RegistrarEquipo
 * para evitar que el dropdown empuje otros campos.
 *
 * @dependencies - COLORS de theme/colors.js
 * @validations  - zIndex y posición relativa para superposición sin alterar layout.
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  select: {
    minHeight: 45,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  disabledSelect: {
    backgroundColor: COLORS.secondary,
    opacity: 0.7,
  },
  dropdownShell: {
    width: "100%",
    height: 180,
    marginTop: 4,
    position: "relative",
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    flex: 1,
    paddingRight: 8,
  },
  arrow: {
    fontSize: 18,
    color: COLORS.textTertiary,
  },
  optionsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    zIndex: 20,
    elevation: 8,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
});