import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  // Contenedor principal (igual que ColaboradoresListScreen)
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // Barra de búsqueda + botón (copiado exactamente de colaboradoresListStyles)
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
    borderColor: COLORS.primary,
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
scrollView: {
  flex: 1,
},
list: {
  padding: 16,
  paddingBottom: 80,
  width: '100%',
  maxWidth: 900,
  alignSelf: 'center',
},

  // Modal de creación/edición
  modalContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  // Modal de confirmación de eliminación
  modalConfirmContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    maxHeight: "80%",
    padding: 16,
  },

  // Botones del modal de confirmación
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

  // Modal de detalle
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

  // Textos de los modales
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

  // Error
  error: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },
});