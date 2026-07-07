/**
 * ============================================================
 * AgregarTrazabilityStyle.js
 * ============================================================
 *
 * Estilos para la pantalla `AgregarTrazabilidadScreen`.
 *
 * Reglas importantes / restricciones:
 * - No usar colores hardcodeados; usar `COLORS`.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  

  scrollContent: {
    paddingVertical: 28,
    paddingBottom: 40,
  },

  wrapper: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  infoBanner: {
    marginBottom: 16,
    alignItems: "center",
  },

  createButton: {
    backgroundColor: COLORS.white,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 24,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  createButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  createButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: "700",
  },
  
});
