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
    maxWidth: "100%",
    alignSelf: "center",
    width: "100%",
    borderWidth: 2,
    color: COLORS.black,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderStyle: "dashed",
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginBottom: 18,
  },

  addButtonText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginLeft: 8,
  },

  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  iconAdd: {
    marginRight: 5
  },

  iconDetail: {
    marginRight: 5
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

});