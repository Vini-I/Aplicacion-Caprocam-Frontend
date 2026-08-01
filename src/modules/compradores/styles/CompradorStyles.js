/**
 * ============================================================
 * STYLES: COMPRADORSTYLES
 * ============================================================
 * Módulo: Compradores
 *
 * Estilos de CompradorScreen.jsx (lista de compradores).
 *
 * FUNCIONALIDAD:
 * 1. Layout del navbar, la barra de búsqueda/filtro, las tarjetas
 *    de cada comprador y el botón flotante de agregar.
 *
 * IMPORTANTE:
 * - btnVerDetalle/btnAgregar no deben tener backgroundColor: el
 *   fondo blanco y el borde celeste los pone Button
 *   variant="outline" en el JSX.
 * ============================================================
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  navbar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingTop: 30,
  },

  navbarRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },

  navbarTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "left",
    color: COLORS.white,
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },

  card: {
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  providerInfo: {
    flex: 1,
  },

  providerName: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  providerType: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: 2,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },

  contactText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },

  btnVerDetalle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 0,
  },

  btnVerDetalleText: {
    fontSize: 13,
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  btnHome: {
    marginTop: 0,
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 0,
  },

  searchBarContainer: {
    flex: 1,
  },

  filterButton: {
    alignSelf: "center",
    marginTop: 0,
    height: 43,
  },

  contadorResultados: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    fontSize: 13,
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  lista: {
    paddingBottom: 16,
  },

  listaContainer: {
    flex: 1,
  },

  btnAgregar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,

    marginBottom: 16,
    borderRadius: 10,
    gap: 8,
  },

  btnAgregarText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  loadingIndicator: {
    marginTop: 32,
  },
});

export const ICON_STYLES = {
  home: {
    size: 28,
    color: COLORS.primary,
  },
  add: {
    size: 18,
    color: COLORS.primary,
  },
  phone: {
    size: 14,
    color: COLORS.textTertiary,
  },
  user: {
    size: 14,
    color: COLORS.textTertiary,
  },
};
