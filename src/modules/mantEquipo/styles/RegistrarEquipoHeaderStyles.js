/**
 * ESTILOS: RegistrarEquipoHeaderStyles
 * Estilos para el encabezado compacto del formulario de registro de equipos.
 *
 * @dependencies - colors.js (theme/colors.js)
 * @validations  - Configura la distribución del icono, tarjeta y textos del encabezado.
 * @navigation   - Ninguna
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors.js";

export const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 0,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  headerTextBox: {
    flex: 1,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: "700",
    marginBottom: 2,
  },
  headerSubtitle: {
    opacity: 0.95,
  },
});