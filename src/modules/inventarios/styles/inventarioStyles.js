import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },

  navbarTitulo: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: "left",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 0,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 0,
    paddingVertical: 0,
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

  alertaTexto: {
    marginLeft: 4,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },

  searchBarContainer: {
    flex: 1,
  },

  filterButton: {
    alignSelf: "center",
    height: 43,
    marginBottom: 10,
  },

  contadorResultados: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  lista: {
    paddingBottom: 24,
  },

  tarjeta: {
    marginHorizontal: 16,
    marginTop: 12,
  },

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

  nombreProducto: {
    flex: 1,
    marginRight: 8,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  badgeCategoria: {
    marginBottom: 12,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  badgeTexto: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  filasDetalle: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  filaDetalle: {
    width: "45%",
    gap: 2,
  },

  etiquetaDetalle: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  valorDetalle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
});