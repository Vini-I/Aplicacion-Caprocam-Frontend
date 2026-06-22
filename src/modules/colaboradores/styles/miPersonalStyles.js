import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
searchContainer: {
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: COLORS.white,
  marginTop: 8,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
searchInput: { marginBottom: 0, flex: 1 },
addButtonContainer: { alignSelf: 'center' },
  list: { padding: 16, paddingBottom: 80 },
  error: { color: COLORS.error, textAlign: "center", marginTop: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
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
  modalInput: { marginBottom: 20 },
  modalButtons: { flexDirection: "row", gap: 12, justifyContent: "center" },
});