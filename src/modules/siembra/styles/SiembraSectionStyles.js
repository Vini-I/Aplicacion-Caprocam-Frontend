/**
 * ============================================================
 * ESTILOS DE SECCIONES - SIEMBRA
 * ============================================================
 *
 * Define estilos reutilizables para los componentes de sección
 * utilizados en los formularios de Siembra.
 *
 * Incluye:
 * - Títulos de sección.
 * - Campos obligatorios.
 * - Estados visuales de error.
 * - Cajas informativas de cálculo.
 *
 * Utiliza colores y tipografías centralizadas del proyecto.
 */
import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  calculationBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  calculationLabel: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textTertiary,
    marginBottom: 4,
  },
  calculationValue: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.textSecondary,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  requiredLabel: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: COLORS.error,
    borderRadius: 8,
  },
  calculationBoxError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
});
