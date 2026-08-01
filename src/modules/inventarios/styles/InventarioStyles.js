/**
 * ============================================================
 * STYLES: InventarioStyles
 * ============================================================
 *
 * Responsabilidad:
 * Estilos visuales de la pantalla de Inventarios (screens/InventarioScreen.jsx).
 *
 * Datos:
 * No aplica, solo estilos.
 *
 * Validaciones:
 * No aplica.
 *
 * Navegación:
 * No aplica.
 *
 * Dependencias:
 * theme/colors.js, theme/typography.js, theme/style.js.
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { STYLE } from "../../../theme/style";

export const styles = StyleSheet.create({
  zonaFiltros: {
    marginTop: 12,
    gap: 10,
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
    alignItems: "center",
    height: 43,
    marginBottom: 8.5,
    flexShrink: 0,
  },

  alertaBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: COLORS.error,
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
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 0,
    flexShrink: 0,
  },

  lista: {
    ...STYLE.contentWrapper,
    paddingBottom: 24,
  },

  tarjeta: {
    marginTop: 12,
    width: "100%",
    overflow: "hidden",
  },

  tarjetaStockBajo: {
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: COLORS.error,
  },

  filaTituloIcono: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  nombreProducto: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    flexShrink: 1,
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
    borderWidth: 1,
    borderColor: COLORS.error,
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
    flexWrap: "wrap",
    gap: 8,
  },

  badgeCategoria: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    flexShrink: 1,
  },

  badgeTexto: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  botonDetalle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    flexShrink: 0,
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