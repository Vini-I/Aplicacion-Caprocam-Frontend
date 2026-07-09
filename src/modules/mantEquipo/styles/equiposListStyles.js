/**
 * ============================================================
 * ESTILOS: equiposListStyles
 * ============================================================
 *
 * Estilos para la pantalla EquiposListScreen.
 * Utiliza la paleta de COLORS del tema central.
 *
 * Dependencias:
 * - COLORS desde theme/colors
 *
 * Ejemplo de uso:
 * import { styles } from './equiposListStyles';
 * <View style={styles.container}>...</View>
 */

// ============================================================
// IMPORTS
// ============================================================
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

// ============================================================
// EXPORTACIÓN DE ESTILOS
// ============================================================
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
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

  btnMant: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "transparent",
    height: 42, // misma altura que el botón agregar
    marginTop: 0,
  },

    btnAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "transparent",
    height: 42,
    marginTop: 0,
  },

  filterButton: {
    height: 43,
    marginTop: 0,
  },

  addButtonContainer: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    borderWidth: 0,
    height: 42, // fijar altura para alinear
    justifyContent: "center",
  },

  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  addButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },

  list: {
    padding: 16,
    paddingBottom: 80,
  },

  error: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },

  // Modal de confirmación
  modalConfirmContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  modalConfirmCancelButton: {
    backgroundColor: COLORS.textTertiary,
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
    marginTop: 0,
    flex: 1,
  },

  modalDeleteBtn: {
    marginTop: 0,
    flex: 1,
  },

  modalDetalleContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  modalDetalleOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  // Tab bar para filtros rápidos
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },

  activeTab: {
    borderBottomColor: COLORS.primary,
  },

  tabText: {
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  // Alertas de mantenimiento
  alertasContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  alertaCard: {
    backgroundColor: COLORS.warningLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.warning,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  alertaCardCritica: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
  },

  alertaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.warning,
    alignItems: "center",
    justifyContent: "center",
  },

  alertaIconCritica: {
    backgroundColor: COLORS.error,
  },

  alertaContent: {
    flex: 1,
  },

  alertaTitle: {
    fontWeight: "600",
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  alertaDescription: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },

  alertaHoras: {
    fontWeight: "700",
    color: COLORS.warning,
    fontSize: 13,
  },

  alertaHorasCritica: {
    color: COLORS.error,
  },
  // Estilos para EquipoStats
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
// Agregar o actualizar estos estilos:

modalContainer: {
  width: "100%",
  maxWidth: 900,
  alignSelf: "center",
  maxHeight: "92%",
  padding: 16,
},

modalConfirmContainer: {
  width: "100%",
  maxWidth: 900,
  alignSelf: "center",
  maxHeight: "80%",
  padding: 16,
},

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

// Asegurar que el contenido del modal de detalle sea scrolleable
detalleScrollContent: {
  flexGrow: 1,
  padding: 16,
  paddingBottom: 40,
},

  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 0,
    borderWidth: 0,
  },

  toggleBtnOn: {
    backgroundColor: COLORS.error, // Rojo cuando está encendido (para apagar)
  },

  toggleBtnOff: {
    backgroundColor: COLORS.success, // Verde cuando está apagado (para encender)
  },

  toggleBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },

  navbarTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "left",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
  },
});