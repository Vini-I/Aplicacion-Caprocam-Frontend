/**
 * ProveedorStyles
 * Estilos para la pantalla de proveedores
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  //Contenedor principal de la pantalla
  screen: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },

  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },

  navbarTitle: {
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

  // Estilos para el avatar con las iniciales del proveedor
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  // Estilos para el texto dentro del avatar
  avatarText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  // Contenedor del nombre y tipo de proveedor
  providerInfo: {
    flex: 1,
  },

  // Estilos para el nombre del proveedor
  providerName: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  // Estilos para el tipo de proveedor
  providerType: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    marginTop: 2,
  },

  // Estilos para la fila de contacto (teléfono y correo)
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },

  // Estilos para el texto de contacto (teléfono y correo)
  contactText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
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

  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },

  btnVerDetalle: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 0,
  },

  btnVerDetalleText: {
    fontSize: 13,
    color: COLORS.white,
  },

  // Contenedor del campo de busqueda
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
  },

  lista: {
    paddingBottom: 24,
  },
});
