/**
 * ============================================================
 * ESTILOS DE FORMULARIO DE FINCA
 * ============================================================
 *
 * Contiene los estilos utilizados en los formularios de creación
 * y edición de una finca.
 *
 * Archivos que afecta:
 * - FincaNuevaScreen.jsx
 * - FincaEditarScreen.jsx
 * - Componentes de formulario relacionados.
 *
 * Incluye estilos para:
 * - Distribución de campos del formulario.
 * - Organización de secciones y columnas.
 * - Botones de guardar y acciones de teléfonos.
 * - Manejo visual de errores en campos obligatorios.
 * - Alertas de validación y mensajes al usuario.
 * - Adaptación del formulario para diferentes tamaños de pantalla.
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  content: {
    padding: 12,
    paddingBottom: 28,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  sectionTitleText: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  column: {
    flex: 1,
    minWidth: 150,
  },
  buttonContainer: {
    marginTop: 12,
  },
  saveButton: {
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  phoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 12,
  },
  phoneTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  addPhoneButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  phoneRowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  phoneInputContainer: {
    flex: 1,
  },
  removePhoneButton: {
    backgroundColor: COLORS.surface,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  addPhoneFallbackText: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: "bold",
  },
  removePhoneFallbackText: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: "bold",
  },
  wrapperError: {
    borderWidth: 1.5,
    borderColor: COLORS.error,
    borderRadius: 8,
    padding: 3,
    backgroundColor: COLORS.errorLight,
  },
  errorBox: {
    backgroundColor: COLORS.errorLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.error,
    alignItems: "center",
  },
  errorBoxText: {
    color: COLORS.error,
    fontWeight: "600",
    fontSize: 14,
  },
  blackTextLabels: {
    color: COLORS.black,
  },
  requiredText: {
    color: COLORS.error,
  },
  fullWidthRow: {
    width: "100%",
    marginTop: 10,
  },
  errorInput: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.surface,
  },
  errorAlertContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  errorAlertItems: {
    textAlign: "center",
    width: "100%",
  },
});
