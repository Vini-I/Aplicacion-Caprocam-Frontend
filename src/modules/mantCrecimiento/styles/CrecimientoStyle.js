/**
 * ============================================================
 * ESTILOS DEL MÓDULO DE CRECIMIENTO
 * ============================================================
 *
 * Define la apariencia visual de la pantalla de registro de peso
 * y crecimiento para mantener un layout consistente dentro del módulo.
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    position: "relative",
  },
  contentScroll: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  cardContent: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerIcon: {
    marginRight: 8,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  inputColumn: {
    flexDirection: "column",

  },
  inputWrapper: {
    flex: 1,
  },
  inputItem: {
    minHeight: 90,
    flex: 1,
    marginBottom: 12,
  },
  sameInput: {
    minHeight: 50,
    justifyContent: "center",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 12,
    marginBottom: 14,
  },
  badgeItem: {
    marginRight: 8,
    marginBottom: 5,
  },
  badgeContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  resultCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 6,
    fontSize: 12,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.secondary,
    borderRadius: 28,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  detalles: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  detalle: {
    color: COLORS.secondary,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  IconoDetalle: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingLeft: 12,
  },
  iconoDetalleText: {
    fontSize: 22,
    color: "#6c757d",
  },
  addButton: {
    maxWidth: 700,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: "row",
  },
  submitButton: {
    marginTop: 12,
  },
  successAlert: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    zIndex: 10,
    elevation: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: COLORS.primary
  }
});
