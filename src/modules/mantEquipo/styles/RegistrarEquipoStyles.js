/**
 * ============================================================
 * ESTILOS: RegistrarEquipo
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Contiene la maquetación y la jerarquía visual del formulario
 * de registro de equipos.
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

  // Pantalla de carga
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Padding del ScrollView según tamaño de pantalla
  contentPaddingSmall: {
    paddingHorizontal: 16,
  },
  contentPaddingLarge: {
    paddingHorizontal: 40,
  },

  // Label de campos del formulario
  labelMedium: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  // Wrapper del Alert de resultado
  alertWrapper: {
    marginBottom: 12,
  },

  // Botones
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  botonesContainer: {
    marginTop: 4,
  },
  saveButtonOutline: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  saveButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    minHeight: 52,
    backgroundColor: COLORS.primary,
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});