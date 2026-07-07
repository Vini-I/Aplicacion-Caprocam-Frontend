/**
 * ============================================================
 * ESTILOS RALEOSTYLES
 * ============================================================
 *
 * Agrupa los estilos del módulo de Raleo: fondo de pantalla,
 * wrapper de contenido centrado, botones de porcentaje de raleo,
 * texto de error de validación y estilos del botón de guardar.
 *
 * Funcionalidad:
 * - Todos los colores usados vienen de COLORS (COLORS.surface,
 *   COLORS.white, COLORS.secondary, COLORS.primary, COLORS.error),
 *   sin valores hardcodeados.
 * - contenido reutiliza STYLE.contentWrapper de theme/style.js en
 *   vez de redefinir manualmente maxWidth/alignSelf/width.
 *
 * Ejemplo:
 * import { styles } from '../styles/raleoStyles';
 * <View style={styles.screen}>
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { STYLE } from "../../../theme/style";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.surface,
  },
  contenido: {
    ...STYLE.contentWrapper,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },

  horasContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  horasContainerInvalid: {
    borderWidth: 1.5,
    borderColor: COLORS.error,
    borderRadius: 8,
    padding: 4,
  },
  pctBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
  },
  pctBtnSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
  errorText: {
    marginTop: -6,
    marginBottom: 8,
    marginLeft: 2,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  saveBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
});
