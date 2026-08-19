/**
 * ESTILOS: colaboradoresListStyles
 * Agrupa las hojas de estilo de la pantalla principal de colaboradores,
 * incluyendo barra de búsqueda, lista, botón flotante y modales.
 *
 * @dependencies - COLORS de theme/colors.js, TYPOGRAPHY de theme/typography.js
 * @validations  - N/A
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  // ── Contenedor principal ────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
    screenContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // ── Barra de búsqueda y filtro ─────────────────────────────
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

  // ── Contador de resultados ──────────────────────────────────
  contadorWrapper: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  contadorResultados: {
    fontSize: 13,
    left: 0,
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  // ── Lista de colaboradores ──────────────────────────────────
  list: {
    padding: 0,
    paddingHorizontal: 0,
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
    textAlign: "center",
  },

  // ── Alertas flotantes ──────────────────────────────────────
  alertWrapper: {
    marginTop: 6,
    marginBottom: 0,
    paddingHorizontal: 0,
    paddingVertical: 10,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },

  // ── Botón flotante (Agregar) ───────────────────────────────
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

  // ── Modal de detalle (override) ─────────────────────────────
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

  // ── Estado vacío (EmptyState) ──────────────────────────────
  emptyStateButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
});