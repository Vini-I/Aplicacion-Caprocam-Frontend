import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";

export const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORS.surface },

  navbar: { backgroundColor: COLORS.primary, borderBottomWidth: 0 },

  navbarTitulo: {
    color: COLORS.white,
    fontSize: 20, // pisa el 18 del Navbar
    fontFamily: TYPOGRAPHY.fontFamily.bold, // pisa el fontWeight: "700"
    fontWeight: undefined, // limpia el fontWeight hardcodeado
  },

  botonAgregar: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginTop: 0,
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

  alertaBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.errorLight,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 8,
  },

  alertaTexto: { marginLeft: 4 },

  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },

  searchBarContainer: { flex: 1 },

  filterButton: { alignSelf: "center", marginTop: 0, height: 43 },

  contadorResultados: { marginHorizontal: 16, marginTop: 10, marginBottom: 4 },

  lista: { paddingBottom: 24 },

  tarjeta: { marginHorizontal: 16, marginTop: 12 },

  tarjetaStockBajo: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.errorLight,
  },

  tarjetaEncabezado: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  nombreProducto: { flex: 1, marginRight: 8 },
  botonEditar: {
    padding: 4,
  },

  badgeCategoria: { marginBottom: 12 },
  filasDetalle: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  filaDetalle: { width: "45%", gap: 2 },

  botonEditar: {
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: 0,
    padding: 4,
    borderWidth: 0,
  },

  tabsInternas: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    backgroundColor: COLORS.white,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 4,
  },

  tabActiva: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
  },
});