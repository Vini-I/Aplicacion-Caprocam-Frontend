/**
 * ============================================================
 * ESTILOS: RegistrarEquipo
 * ============================================================
 *
 * Contiene la maquetación y la jerarquía visual del formulario
 * de registro de equipos.
 * Ruta: src/modules/mantEquipo/styles/RegistrarEquipoStyles.js
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
  },
  card: {
    marginBottom: 14,
    overflow: "visible",
  },
  sectionTitle: {
    fontWeight: "700",
    letterSpacing: 0.3,
    color: COLORS.textPrimary,
  },
  groupTitle: {
    fontWeight: "700",
    letterSpacing: 0.2,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSpacer: {
    height: 12,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  column: {
    flex: 1,
    minWidth: 220,
  },
  selectContainerTop: {
    zIndex: 2,
    position: "relative",
  },
  selectContainerBottom: {
    zIndex: 1,
    position: "relative",
  },
  fullWidth: {
    width: "100%",
  },
  selectsArea: {
    marginTop: 8,
    paddingTop: 4,
    paddingBottom: 12,
    overflow: "visible",
  },
  textArea: {
    minHeight: 140,
  },
  fieldErrorText: {
    marginTop: 4,
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "600",
  },
  invalidField: {
    borderColor: COLORS.error,
  },
  errorBox: {
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: COLORS.error,
    fontWeight: "600",
  },
  saveButton: {
    marginTop: 4,
    minHeight: 52,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});