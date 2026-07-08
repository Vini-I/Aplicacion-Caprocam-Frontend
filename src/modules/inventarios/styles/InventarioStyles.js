import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  navbar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingTop: 30,
    borderBottomWidth: 0,
  },

  navbarTitulo: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "left",
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 0,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  zonaFiltros: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 16,
    marginTop: 12,
  },

  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  searchBarContainer: {
    flex: 1,
  },

  filterButton: {
    alignItems: "stretch",
    height: 43,
    marginBottom: 8.5,
    flexShrink: 0,
  },

  alertaBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.errorLight,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 8,
  },

  alertaTexto: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    flex: 1,
  },

  filaContadorBoton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 4,
    gap: 8,
  },

  contadorResultados: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    flexShrink: 1,
  },

  botonAgregar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 38,
    borderRadius: 8,
    borderWidth: 0,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 0,
    flexShrink: 0,
  },

  lista: {
    paddingBottom: 24,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  tarjeta: {
    marginTop: 12,
    alignSelf: "stretch",
  },

  tarjetaStockBajo: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.errorLight,
  },

  nombreProducto: {
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  badgeStockBajo: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    marginBottom: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: COLORS.errorLight,
  },

  badgeStockBajoTexto: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  filaCategoriaBoton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 2,
  },

  badgeCategoria: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  badgeTexto: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  botonDetalle: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: "center",
    backgroundColor: COLORS.primary,
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