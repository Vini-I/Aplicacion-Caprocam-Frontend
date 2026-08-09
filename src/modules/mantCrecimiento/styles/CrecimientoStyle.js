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
  },
  inputError: {
    borderColor: COLORS.error,
  },
  seccionCalculos: {
    marginTop: 16,
    marginBottom: 8,
  },
  seccionCalculosHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  seccionTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  btnAgregar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  btnIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  btnAgregarText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  filaCalculo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  filaCalculoIndex: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.secondary,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "700",
    color: COLORS.primary,
    overflow: "hidden",
  },
  filaCalculoDatos: {
    minWidth: 72,
    marginRight: 8,
  },
  filaCalculoValor: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  filaCalculoPromedio: {
    color: COLORS.success,
  },
  filaCalculoLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  filaCalculoAcciones: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 6,
  },
  btnFila: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  btnFilaText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  btnFilaEliminar: {
    borderColor: COLORS.error,
  },
  btnFilaEliminarText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "600",
  },
  formCalculo: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  formCalculoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  formCalculoTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  btnQuitar: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  btnQuitarText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "600",
  },
  formCalculoFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  formCalculoCampos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  formCalculoCampo: {
    flexGrow: 1,
    minWidth: 140,
  },
  totalLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  totalReadonly: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  totalValor: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  promedioBox: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  promedioLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
  },
  promedioValor: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
