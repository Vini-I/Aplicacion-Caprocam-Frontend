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
 * import { styles } from '../styles/RaleoStyles';
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
  scrollContent: {
    paddingBottom: 96,
  },
  contenido: {
    ...STYLE.contentWrapper,
    gap: 12,
  },
  spacer: {
    height: 20,
  },
  alert: {
    marginTop: 12,
    marginBottom: 4,
  },
  errorText: {
    marginTop: -6,
    marginBottom: 8,
    marginLeft: 2,
  },
  saveBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButton: {
    marginTop: 12,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: COLORS.primary,
  },

  bordeError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionIcon: {
    marginRight: 8,
  },
});
