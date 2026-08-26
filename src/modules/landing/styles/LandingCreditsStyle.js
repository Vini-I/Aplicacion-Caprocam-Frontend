/**
 * ============================================================
 * ESTILOS DE LA PÁGINA DE CRÉDITOS
 * ============================================================
 *
 * Define la apariencia y distribución de la pantalla que muestra
 * los créditos académicos del proyecto CAPROCAM.
 *
 * Contenido:
 * - Configura el fondo, contenedor principal y desplazamiento vertical.
 * - Estiliza los datos institucionales y el título del curso.
 * - Define la tarjeta que contiene a los integrantes del proyecto.
 * - Organiza a los líderes y desarrolladores mediante columnas.
 * - Muestra tres columnas en computadora, dos en tableta y una en móvil.
 * - Diferencia visualmente los títulos de cada equipo y al profesor.
 * - Configura el botón utilizado para regresar a la página principal.
 * - Utiliza los colores y tipografías definidos en el tema del proyecto.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  institution: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 23,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  campus: {
    marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 17,
    color: COLORS.primary,
    textAlign: "center",
  },

  title: {
    marginTop: 8,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 27,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 3,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 14,
    color: COLORS.textTertiary,
    textAlign: "center",
  },

  card: {
    width: "100%",
    maxWidth: 1100,
    marginTop: 12,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,

    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  teamSection: {
    width: "100%",
    marginBottom: 14,
  },

  sectionTitle: {
    marginBottom: 9,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 14,
    color: COLORS.primary,
    textAlign: "center",
  },

  studentsContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    columnGap: "2%",
    rowGap: 7,
  },

  /*
   * Computadoras:
   * muestra tres estudiantes en cada fila.
   */
  studentItem: {
    width: "32%",
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
  },

  /*
   * Pantallas medianas:
   * mantiene tres estudiantes por fila.
   */
  studentItemMedium: {
    width: "32%",
  },

  /*
   * Tabletas:
   * muestra dos estudiantes por fila.
   */
  studentItemTablet: {
    width: "49%",
  },

  /*
   * Celulares:
   * muestra un estudiante por fila.
   */
  studentItemMobile: {
    width: "100%",
  },

  studentBullet: {
    width: 6,
    height: 6,
    marginRight: 8,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  studentName: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.textSecondary,
  },

  professorSection: {
    width: "100%",
    marginTop: 2,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.textQuaternary,
    alignItems: "center",
  },

  professorLabel: {
    marginBottom: 3,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 12,
    color: COLORS.primary,
  },

  professorName: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  backButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
  },

  backButtonPressed: {
    opacity: 0.8,
  },

  backButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 13,
    color: COLORS.white,
  },
});
