/**
 * ============================================================
 * ESTILOS ALIMENTACIONSTYLES
 * ============================================================
 *
 * Agrupa los estilos del módulo de Alimentación: fondo de
 * pantalla, wrapper de contenido centrado, etiquetas de sección
 * y estilos heredados de header usados por pantallas más
 * antiguas del módulo.
 *
 * Funcionalidad:
 * - Todos los colores usados vienen de COLORS (COLORS.surface,
 *   COLORS.primary), sin valores hardcodeados.
 * - container/content siguen el mismo patrón consistente que ya
 *   usan Raleo y Densidad Poblacional: container es el fondo de
 *   pantalla (flex:1 + COLORS.surface) y content es el wrapper
 *   centrado (...STYLE.contentWrapper de theme/style.js), en vez
 *   de anidar 2 wrappers distintos (contenido + alimentacionContent)
 *   como se hacía antes.
 * - `screen` se conserva porque RegistroAlimentacionScreen.jsx y
 *   HistorialAlimentacionScreen.jsx todavía lo usan.
 *
 * Ejemplo:
 * import { styles } from '../styles/AlimentacionStyles';
 * <View style={styles.container}>
 */

import { StyleSheet, Platform, StatusBar } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
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