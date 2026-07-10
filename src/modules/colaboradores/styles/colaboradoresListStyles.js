/**
 * ============================================================
 * ESTILOS: colaboradoresListStyles
 * ============================================================
 *
 * Estilos para la pantalla ColaboradoresListScreen.
 * Utiliza la paleta de COLORS del tema central.
 *
 * Dependencias:
 * - COLORS desde theme/colors
 *
 * Ejemplo de uso:
 * import { styles } from './colaboradoresListStyles';
 * <View style={styles.container}>...</View>
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
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
addButtonContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: COLORS.primary,   // se sobrescribe en la prop style
  backgroundColor: "transparent",
  height: 42,
  marginTop: 0,
},
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
addButtonText: {
  color: COLORS.primary,
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
  modalConfirmCancelButton: {
    backgroundColor: COLORS.textTertiary,
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
  maxHeight: "85%",           // ← Limita la altura para que no ocupe toda la pantalla
  alignSelf: "center",
  padding: 16,                // ← Márgenes internos estándar
  borderRadius: 16,
  overflow: "hidden",
  backgroundColor: COLORS.surface,
},

modalDetalleOverlay: {
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",   // ← Centra verticalmente el modal
  padding: 16,                // ← Márgenes externos en pantallas pequeñas
},
});