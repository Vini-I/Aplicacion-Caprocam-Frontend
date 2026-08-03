/**
 * ============================================================
 * ESTILOS DE LISTADO DE FINCAS
 * ============================================================
 *
 * Contiene los estilos utilizados en la pantalla principal donde
 * se muestran las fincas registradas y sus acciones disponibles.
 *
 * Archivos que afecta:
 * - FincasScreen.jsx
 * - Componentes de tarjetas de finca.
 * - Botones de acciones CRUD.
 *
 * Incluye estilos para:
 * - Organización visual de las tarjetas de finca.
 * - Contenedor de iconos y datos principales.
 * - Etiquetas informativas de la finca.
 * - Botones para editar y eliminar registros.
 * - Botón de creación de nuevas fincas.
 * - Alertas de confirmación para operaciones CRUD.
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  content:{
    paddingBottom: 70,
  },
  
  card: {
    flexDirection: "row",
  },

  cardContent: {
    flex: 1,
    flexDirection: "row",
  },

  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.secondary,
    borderRadius: 28,
    marginTop: 5,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  flex: {
    flex: 1,
  },

  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  detailsColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  detail: {
    color: COLORS.primary,
    backgroundColor: COLORS.secondary,
    alignSelf: "flex-start",
  },

  buttonsCrud: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginRight: 10,
  },

  delete: {
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

  deleteIcon: {
    color: COLORS.error,
  },

  edit: {
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

  editIcon: {
    color: COLORS.primary,
  },

  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "transparent", // Contenedor transparente sin sombras ni cajas raras
    alignItems: "center",
    justifyContent: "center",
  },

  addButton: {
    borderWidth: 2,
    color: COLORS.primary,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: "auto",
  },

  addButtonText: {
    color: COLORS.primary,
    fontWeight: 600,
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
