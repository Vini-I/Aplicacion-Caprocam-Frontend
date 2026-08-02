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
  content:{
    paddingBottom: 55,
  },

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

  addButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  titleText: {
    alignSelf: "center",
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
    height: "70%",
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
    height: "70%",
  },

  alertCorrect: {
    alignItems: "center",
    backgroundColor: COLORS.successLight,
    borderWidth: 1.5,
    borderColor: COLORS.success,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  alertIncorrect: {
    alignItems: "center",
    backgroundColor: COLORS.errorLight,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

});