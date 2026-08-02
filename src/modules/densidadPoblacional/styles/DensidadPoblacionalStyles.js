/**
 * ============================================================
 * ESTILOS DENSIDADPOBLACIONALSTYLES
 * ============================================================
 *
 * Agrupa los estilos del modulo de Densidad Poblacional: fondo
 * de pantalla, wrapper de contenido centrado, subtitulos de
 * seccion, etiquetas de campo y el boton de guardar.
 *
 * Funcionalidad:
 * - container usa COLORS.surface (antes COLORS.white) para ser
 *   visualmente consistente con Alimentacion y Raleo.
 * - content y addButton reutilizan STYLE.contentWrapper de
 *   theme/style.js en vez de redefinir manualmente
 *   maxWidth/alignSelf/width en cada uno.
 * - Se eliminaron los estilos que ningun archivo de este modulo
 *   usa (verificado con busqueda antes de eliminar): backBtn,
 *   headerTitle, headerTitleText, header, title, buttonText,
 *   fechaContainer, fechaInput, calendarButton, row, half.
 *
 * Ejemplo:
 * import { styles } from '../styles/DensidadPoblacionalStyles';
 * <View style={styles.container}>
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  content: {
    ...STYLE.contentWrapper,
  },

  // Deja espacio para que el boton flotante no tape la ultima card.
  scrollContent: {
    paddingBottom: 96,
  },

  // Boton "Guardar" flotante, mismo ancho que las cards (margen de
  // 16 a cada lado, igual que STYLE.container).
  floatingFooter: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },

  // Alert de exito, fijo arriba de toda la pantalla (Regla 2).
  topAlert: {
    marginHorizontal: 16,
    marginTop: 8,
  },

  alert: {
    marginTop: 12,
    marginBottom: 4,
  },

  subTitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionIcon: {
    marginRight: 8,
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: COLORS.primary
  },
  submitButton: {
    marginTop: 12,
  },

});