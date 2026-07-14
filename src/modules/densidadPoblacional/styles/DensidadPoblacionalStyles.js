/**
 * ============================================================
 * ESTILOS DENSIDADPOBLACIONALSTYLES
 * ============================================================
 *
 * Agrupa los estilos del módulo de Densidad Poblacional: fondo
 * de pantalla, wrapper de contenido centrado, subtítulos de
 * sección, etiquetas de campo y el botón de guardar.
 *
 * Funcionalidad:
 * - container usa COLORS.surface (antes COLORS.white) para ser
 *   visualmente consistente con Alimentación y Raleo.
 * - content y addButton reutilizan STYLE.contentWrapper de
 *   theme/style.js en vez de redefinir manualmente
 *   maxWidth/alignSelf/width en cada uno.
 * - Se eliminaron los estilos que ningún archivo de este módulo
 *   usa (verificado con búsqueda antes de eliminar): backBtn,
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

  subTitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },

  addButton: {
    ...STYLE.contentWrapper,
  },
});
