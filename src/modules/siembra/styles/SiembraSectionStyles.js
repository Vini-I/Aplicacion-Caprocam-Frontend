/**
 * ============================================================
 * ESTILOS DE SECCIONES - SIEMBRA
 * ============================================================
 *
 * Define estilos reutilizables para los componentes de sección
 * utilizados en los formularios de Siembra.
 *
 * Incluye:
 * - Títulos de sección.
 * - Campos obligatorios.
 * - Estados visuales de error.
 * - Cajas informativas de cálculo.
 * - Links "+ Agregar nuevo" / "Ver todos": livianos (solo texto,
 *   sin caja), pero con hitSlop en DatosLarvaSection.jsx para
 *   mantener un área táctil cómoda en mobile sin verse grandes.
 *
 * Utiliza colores y tipografías centralizadas del proyecto.
 */
import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  calculationBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  calculationLabel: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textTertiary,
    marginBottom: 4,
  },
  calculationValue: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textSecondary,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  requiredLabel: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: COLORS.error,
    borderRadius: 8,
  },
  calculationBoxError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  modalTitulo: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  modalContainer: {
    maxWidth: 900,
    alignSelf: "center",
  },
  listaScroll: {
    maxHeight: 320,
  },
  alert: {
    marginTop: 4,
    marginBottom: 8,
  },
  errorNombreNuevo: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  linksCatalogoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
    marginBottom: 14,
  },
  textoLinkCatalogo: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    paddingVertical: 4,
  },
  btnLinkCatalogo: {
    backgroundColor: "transparent",
    marginTop: 0,
    paddingVertical: 8,
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  separadorLinks: {
    color: COLORS.textTertiary,
    fontSize: 13,
  },

  itemListaVacio: {
    color: COLORS.textTertiary,
    fontSize: 13,
    marginBottom: 12,
  },
  itemListaFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  itemListaNombre: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  itemListaAcciones: {
    flexDirection: "row",
    gap: 4,
  },
  btnItemLista: {
    marginTop: 0,
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnItemListaEliminar: {
    borderColor: COLORS.error,
  },
  textoBtnEliminarCatalogo: {
    color: COLORS.error,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  textoBoton: {
    color: COLORS.primary,
  },
});
