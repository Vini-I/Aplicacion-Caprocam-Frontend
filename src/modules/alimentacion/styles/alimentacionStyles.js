/**
 * ============================================================
 * ESTILOS ALIMENTACIONSTYLES
 * ============================================================
 *
 * Agrupa los estilos del módulo de Alimentación: fondo de
 * pantalla, contenedor de scroll, wrapper de contenido
 * centrado, etiquetas de sección y estilos heredados de header
 * usados por pantallas más antiguas del módulo.
 *
 * Funcionalidad:
 * - Todos los colores usados vienen de COLORS (COLORS.surface,
 *   COLORS.primary), sin valores hardcodeados.
 * - alimentacionContent reutiliza STYLE.contentWrapper de
 *   theme/style.js en vez de redefinir manualmente
 *   maxWidth/alignSelf/width.
 *
 * Ejemplo:
 * import { styles } from '../styles/alimentacionStyles';
 * <View style={styles.screen}>
 */

import { StyleSheet, Platform, StatusBar } from "react-native";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  contenido: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: 100,
  },

  alimentacionContent: {
    ...STYLE.contentWrapper,
    marginVertical: 20,
    gap: 12,
  },

  secLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  spacer: {
    height: 20,
  },

  fab: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },

  btnPrimario: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 12,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerTitleText: {
    fontSize: 22,
    fontWeight: "700",
  },
});