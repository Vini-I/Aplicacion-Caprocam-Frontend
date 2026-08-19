/**
 * ESTILOS: equipoDetalleStyles
 * Estilos visuales para la pantalla de detalle de equipo (EquipoDetalleScreen).
 *
 * @dependencies - colors.js (theme/colors.js), typography.js (theme/typography.js)
 * @validations  - Maquetación de tarjetas de información, cabeceras y métricas.
 * @navigation   - Ninguna
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },

  closeButton: {
    padding: 8,
    alignItems: "flex-end",
    marginBottom: 4,
  },

  closeButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  card: {
    marginBottom: 16,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  equipoInfo: {
    flex: 1,
  },

  badgeEstado: {
    marginTop: 4,
    alignSelf: "flex-start",
  },

  badgeCodigo: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondary,
  },

  badgeCodigoTexto: {
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  // Botón Encender/Apagar dentro del card
  toggleContainer: {
    marginTop: 12,
    marginBottom: 8,
  },

  botonToggle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 0,
    width: "100%",
  },

  botonToggleOn: {
    backgroundColor: COLORS.error,
  },

  botonToggleOff: {
    backgroundColor: COLORS.success,
  },

  botonToggleTexto: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.white,
  },

  // Sección de información
  seccion: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingTop: 12,
  },

  seccionTitulo: {
    marginBottom: 12,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.textSecondary,
  },

  // Filas de detalle con ícono alineado
  filaDetalle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  filaDetalleIcono: {
    width: 24,
    alignItems: "center",
    marginRight: 8,
  },

  filaDetalleContenido: {
    flex: 1,
  },

  filaEtiqueta: {
    marginBottom: 2,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.textSecondary,
  },

  filaValor: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },

  filaValorLink: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },

  // Horas de uso
  horasContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
  },

  horasRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  horasLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  horasIcon: {
    marginRight: 4,
  },

  horasLabel: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },

  horasValor: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },

  horasValorCritico: {
    color: COLORS.error,
  },

  // Historial de encendidos
  registroItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },

  registroFecha: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },

  registroHoras: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  error: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },

  // Footer fijo con botones
  footerContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  footerButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  boton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 0,
  },

  botonEditar: {
    backgroundColor: COLORS.primary,
  },

  botonEliminar: {
    backgroundColor: COLORS.error,
  },

  botonCerrar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
    marginTop: 0,
  },

  botonTexto: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.white,
  },
});

export const ICON_SIZE = {
  boton: 20,
};