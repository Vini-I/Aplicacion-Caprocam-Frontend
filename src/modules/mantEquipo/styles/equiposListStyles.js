/**
 * ============================================================
 * ESTILOS: equiposListStyles
 * ============================================================
 *
 * Estilos para la pantalla EquiposListScreen y sus componentes
 * internos: EquipoCard, modales de confirmación y detalle,
 * estadísticas y barra de búsqueda/filtros.
 *
 * @dependencies - StyleSheet de react-native
 *               - COLORS de theme/colors
 * @validations  - No hardcodear colores; usar únicamente COLORS.
 *               - Las clases formScroll* y formAlert* fueron eliminadas
 *                 (pertenecían a EquipoForm.jsx, nunca se usaron aquí).
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({

  mainFlex: {
    flex: 1,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    marginTop: 8,
    gap: 8,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
  },

  filterGroupLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 4,
  },

  filterChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },

  list: {
    paddingBottom: 110,
    left: 0,
  },

  error: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },

  floatingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "transparent",
  },

  floatingButton: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingVertical: 12,
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

  // ----- Estilos de EquipoCard -----
  card: {
    marginBottom: 12,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  nombre: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 8,
  },

  estadoBadge: {
    alignSelf: "flex-start",
  },

  details: {
    marginTop: 2,
  },

  detailText: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  infoItem: {
    flex: 1,
  },

  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  infoIcon: {
    marginRight: 4,
  },

  infoLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  infoValueCritico: {
    color: COLORS.error,
  },

  actions: {
    marginTop: 10,
    gap: 8,
  },

  // ─ Indicador de estado pasivo (punto + texto) ───────────────────
  estadoActualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
    marginBottom: 2,
  },
  estadoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  estadoDotEncendido: {
    backgroundColor: COLORS.success,
  },
  estadoDotApagado: {
    backgroundColor: COLORS.textQuaternary,
  },
  estadoActualText: {
    fontSize: 12,
    fontWeight: '500',
  },
  estadoActualTextEncendido: {
    color: COLORS.success,
  },
  estadoActualTextApagado: {
    color: COLORS.textQuaternary,
  },

  // ─ Botón de acción (muestra qué va a ocurrir) ─────────────────
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 0,
    borderWidth: 0,
  },
  // Acción ENCENDER: outline verde, sin relleno
  toggleBtnEncender: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  // Acción APAGAR: outline rojo, sin relleno
  toggleBtnApagar: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  // Acción DESHABILITADO (en mantenimiento o inactivo)
  toggleBtnDeshabilitado: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    opacity: 0.45,
  },
  // Label base
  toggleBtnLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  toggleBtnLabelEncender: {
    color: COLORS.success,
  },
  toggleBtnLabelApagar: {
    color: COLORS.error,
  },
  toggleBtnLabelDeshabilitado: {
    color: COLORS.textTertiary,
  },

  // ----- Modal de confirmación -----
  modalConfirmContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    maxHeight: "80%",
    padding: 16,
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

  modalCodigo: {
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

  modalCancelBtn: {
    flex: 1,
    marginTop: 0,
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: "transparent",
  },

  modalCancelBtnText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  modalDeleteBtn: {
    flex: 1,
    marginTop: 0,
    borderColor: COLORS.error,
    borderWidth: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  modalDeleteBtnText: {
    color: COLORS.error,
    fontWeight: "600",
  },

  alertWrapper: {
  marginTop: 12,
  marginBottom: 12,
  paddingHorizontal: 0,
  width: '100%',
  maxWidth: 900,
  alignSelf: 'center',
  },

  // ----- Modal de detalle -----
  modalDetalleContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    maxHeight: "92%",
    padding: 0,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: "hidden",
  },

  modalDetalleOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },

  // ----- Estadísticas -----
  statsCard: {
    marginBottom: 16,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statsExtra: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
  },

  statsExtraText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: 4,
  },

  statItem: {
    alignItems: "center",
    flex: 1,
    minWidth: 70,
    paddingVertical: 4,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  statValueCritico: {
    color: COLORS.error,
  },

  statValueEncendido: {
    color: COLORS.success,
  },

  statLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
    textAlign: "center",
  },

  // ----- Otros -----
  modalContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    maxHeight: "92%",
    padding: 16,
  },

  modalContentContainer: {
    flex: 1,
    flexDirection: "column",
  },

  modalTitleHeader: {
    padding: 16,
    paddingBottom: 0,
  },

  modalScrollForm: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  modalScrollFormContent: {
    paddingBottom: 16,
  },

  modalFooterButtons: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    gap: 12,
  },

  modalFooterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
  },

  modalFooterButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  modalErrorAlert: {
    marginBottom: 12,
  },

  errorInput: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
});