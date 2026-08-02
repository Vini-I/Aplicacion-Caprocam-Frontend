/**
 * ============================================================
 * ESTILOS: colaboradoresListStyles
 * ============================================================
 *
 * Estilos para la pantalla ColaboradoresListScreen.
 * Se eliminaron los estilos de la tabBar y se ajustó el
 * botón flotante para que quede fijo en la parte inferior.
 *
 * Dependencias:
 * - COLORS desde theme/colors
 * - TYPOGRAPHY desde theme/typography
 * ============================================================
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    marginTop: 8,
    gap: 8,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  filterButtonStyle: {
    height: 42,
    borderColor: COLORS.textTertiary,
    marginTop: 0,
    alignSelf: "center",
  },

  // Contador de resultados
  contadorWrapper: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 0,
    marginTop: 8,
    marginBottom: 4,
  },
  contadorResultados: {
    fontSize: 13,
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  list: {
    padding: 0,
    paddingBottom: 110, // espacio para el botón flotante
    width: '100%',
    left: 0,
    maxWidth: 900,
    alignSelf: 'center',
  },
  error: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  alertWrapper: {
    marginTop: 6,           // ← separación de la barra de búsqueda
    marginBottom: 12,        // ← separación de los cards
    paddingHorizontal: 0,
    paddingVertical: 0,     // o 16 si quieres padding interno, pero el Alert ya tiene padding
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },

  // Botón flotante
  floatingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
  },
  floatingButton: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    backgroundColor: "transparent",
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  floatingButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 13,
  },

  // Estilos del modal de confirmación
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.error,
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginBottom: 8,
    textAlign: "center",
  },
  modalName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  modalSubText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginBottom: 8,
    textAlign: "center",
  },
  modalCedula: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  modalConfirmContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  modalCancelBtn: {
    marginTop: 0,
    flex: 1,
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  modalDeleteBtn: {
    marginTop: 0,
    flex: 1,
    borderColor: COLORS.error,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  modalDetalleContainer: {
    width: "100%",
    maxWidth: 900,
    maxHeight: "85%",
    alignSelf: "center",
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },
  modalDetalleOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },
  emptyStateButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
});