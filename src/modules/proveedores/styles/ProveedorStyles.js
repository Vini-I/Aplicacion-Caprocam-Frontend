/**
 * ProveedorStyles.js
 * Estilos para la pantalla principal de proveedores.
 *
 * FUNCIONALIDAD:
 * - Define los estilos de la lista de proveedores (Cards iterativas).
 * - Organiza visualmente la barra de búsqueda y el botón de filtro.
 * - Contiene estilos para los avatares (círculos con iniciales).
 * - Posiciona absolutamente el botón flotante "Agregar Proveedor".
 *
 * REGLAS IMPORTANTES:
 * - El botón de "Agregar" se ancla abajo para estar siempre visible.
 * - Los iconos usan colores temáticos definidos en ICON_STYLES.
 * - Se elimina el padding general usando STYLE.contentWrapper.
 * - Garantiza la separación uniforme entre cada CardPress.
 *
 * @dependencies - StyleSheet, COLORS, TYPOGRAPHY, theme/style
 * @validations - N/A
 * @navigation - N/A
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  alertSuccess: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 14,
    borderWidth: 0,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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

  searchBarContainer: {
    flex: 1,
    minHeight: 46,
    justifyContent: "center",
    marginBottom: 0,
  },

  filterButton: {
    alignSelf: "center",
    width: 120,
    justifyContent: "center",
    marginTop: 0,
    height: 46,
  },

  contadorResultados: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 13,
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },

  floatingButtonWrapper: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
  },

  btnAgregar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
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
};