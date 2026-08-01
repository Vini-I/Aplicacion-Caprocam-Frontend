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
import { TYPOGRAPHY } from "../../../theme/typography";

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

  // Contenedor de GestionAlimentacion: scroll + botón flotante fijo.
  gestionContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 96,
  },

  // Botón "Guardar" flotante, mismo ancho que las cards (margen de
  // 16 a cada lado, igual que STYLE.container).
  floatingFooter: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },

  // Alert de éxito, fijo arriba de toda la pantalla (Regla 2).
  topAlert: {
    marginHorizontal: 16,
    marginTop: 8,
  },

  alert: {
    marginTop: 12,
    marginBottom: 4,
  },

  bordeError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },

  // Secciones de AlimentacionForm* (título + ícono de cada Card).
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionIcon: {
    marginRight: 8,
  },

  dateLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  horaLabel: {
    marginBottom: 6,
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

  horaButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
  },

  horaButtonSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },

  horaError: {
    marginTop: 5,
  },

  // Referenciados por las screens no enrutadas actualmente
  // (RegistroAlimentacionScreen.jsx, HistorialAlimentacionScreen.jsx).
  total: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  btnVolver: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  btnGuardar: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 16,
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
    color: COLORS.primary
  }
}); 