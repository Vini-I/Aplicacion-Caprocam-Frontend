import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";

export const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORS.surface },
  navbar: { backgroundColor: COLORS.primary, borderBottomWidth: 0 },
  navbarTitulo: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
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
  contentContainer: { padding: 16, paddingBottom: 40 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  tarjeta: { marginBottom: 20, borderColor: COLORS.secondary },
  headerSeccion: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  proveedorInfo: { flex: 1 },
  tipoProductoBadge: { marginTop: 6, alignSelf: "flex-start" },
  detallesSección: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingTop: 12,
  },
  sectionTitle: { color: COLORS.textSecondary, marginBottom: 12 },
  filaDetalle: { marginBottom: 12 },
  botonesSección: { flexDirection: "row", gap: 12, marginTop: 20 },
  botonAccion: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  botonEditar: { backgroundColor: COLORS.primary },
  botonEliminar: { backgroundColor: COLORS.error },
  // estilos del modal de confirmación
  modalTitulo: { color: COLORS.textSecondary, marginBottom: 8 },
  modalTexto: { marginBottom: 16 },
  botonModalEliminar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.error,
  },
});