/**
 * ============================================================
 * ESTILOS LISTADO DE PROVEEDORES
 * ============================================================
 *
 * Estilos de la pantalla ProveedorScreen (listado).
 *
 * FUNCIONALIDAD:
 * 1. Colores y tipografia salen de theme/colors y theme/typography.
 * 
 * 2. La screen usa STYLE.container + STYLE.contentWrapper (theme/style)
 *    como único wrapper
 *
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
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
    color: COLORS.black,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: 2,
  },

  contactTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 4,
  },

  contactTitle: {
    color: COLORS.black,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
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

  btnAgregar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
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
});

export const ICON_STYLES = {
  add: {
    color: COLORS.primary,
  },
  phone: {
    color: COLORS.primary,
  },
  user: {
    color: COLORS.primary,
  },
  verDetalle: {
    color: COLORS.primary,
  },
};