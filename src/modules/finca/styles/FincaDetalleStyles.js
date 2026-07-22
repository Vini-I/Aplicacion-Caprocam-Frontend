/**
 * ============================================================
 * ESTILOS DE DETALLE DE FINCA
 * ============================================================
 *
 * Contiene los estilos visuales utilizados en la pantalla de
 * detalle de una finca y sus elementos relacionados.
 *
 * Archivos que afecta:
 * - FincaDetalleScreen.jsx
 * - Componentes de información de finca.
 * - Visualización de estanques asociados.
 *
 * Incluye estilos para:
 * - Distribución de datos generales de la finca.
 * - Botones de generación de reportes y registro.
 * - Tarjetas de estanques y sus dimensiones.
 * - Botones de acciones como editar y eliminar.
 * - Elementos visuales como iconos, etiquetas y valores.
 */
import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors"

export const styles = StyleSheet.create({

  filaDetalle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 4,
  },

  etiqueta: {
    width: 120,
    fontWeight: "bold",
    color: COLORS.black,
  },

  valor: {
    flex: 2,
    textAlign: "right",
    color: COLORS.textTertiary,
  },

  buttonExport: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.successLight,
    borderWidth: 1.5,
    borderColor: COLORS.success,

    paddingVertical: 10,
    borderRadius: 10,
  },

  iconDocument: {
    marginRight: 3
  },

  addButton: {
    borderWidth: 2,
    color: COLORS.primary,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    marginVertical: 20,
  },

  addButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  titleText: {
    marginBottom: 8,
    color: COLORS.textTertiary,
  },

  //Estilos Estanque

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.secondary,
    borderRadius: 28,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  codigo: {
    flex: 1,
  },

  estado: {
    marginLeft: "auto",
  },

  dimensiones: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15
  },

  item: {
  flex: 1,
  alignItems: "center",
  paddingVertical: 8,
  backgroundColor: COLORS.primaryLight, // o un tono suave
  borderRadius: 10,
  marginHorizontal: 4,
},

  label: {
    fontSize: 12,
    color: COLORS.black,
  },

  valorE: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },

  Buttons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 10,
  },

  Eliminar: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.error,
    borderWidth: 2,
    marginBottom: "auto",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 2,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },

  Editar: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 2,
    marginBottom: "auto",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },


  alertMensaje: {
    marginBottom: 12,
  },

  iconEliminar: {
    color: COLORS.error,
    marginRight: 6,
  },

  textEliminar: {
    color: COLORS.error,
    fontWeight: "700",
  },

  iconEditar: {
    color: COLORS.primary,
    marginRight: 6,
  },

  textEditar: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.errorLight,
  },

  modalIconContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.errorLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  modalTitle: {
    color: COLORS.textPrimary,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },

  modalMessage: {
    color: COLORS.textTertiary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 14,
  },

  modalActions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  modalNoButton: {
    flex: 1,
    borderColor: COLORS.textTertiary,
    backgroundColor: COLORS.white,
  },

  modalYesButton: {
    flex: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.white,
  },

  modalNoText: {
    color: COLORS.textTertiary,
    fontWeight: "800",
  },

  modalYesText: {
    color: COLORS.error,
    fontWeight: "800",
  },

});