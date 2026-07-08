/**
 * ============================================================
 * ESTILOS DEL MODAL DE ELIMINACIÓN DE FINCA
 * ============================================================
 *
 * Contiene los estilos utilizados en el modal de confirmación
 * para eliminar una finca registrada.
 *
 * Archivos que afecta:
 * - ModalEliminarFinca.jsx
 *
 * Incluye estilos para:
 * - Botón de cancelar la acción de eliminación.
 * - Botón de confirmación con diseño de advertencia.
 * - Texto de confirmación y mensajes centrados.
 * - Resaltado del nombre de la finca seleccionada.
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: COLORS.textTertiary,
  },

  confirmButton: {
    backgroundColor: COLORS.error,
    marginTop: 12,
    flexDirection: "row",
  },
  confirmButtonText: {
    color: COLORS.white,
  },

  centeredText: {
    alignSelf: "center",
  },

  boldText: {
    fontWeight: "bold",
  },
});
