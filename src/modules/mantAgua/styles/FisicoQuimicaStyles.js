/**
 * ============================================================
 * ESTILOS - FÍSICO-QUÍMICA
 * ============================================================
 *
 * Descripción:
 * Estilos para la pantalla `FisicoQuimicaScreen` y sus
 * componentes relacionados (RangeCard). Define el layout del
 * formulario, contenedores y wrappers necesarios para el
 * comportamiento correcto del UI en web y móvil.
 *
 * Funcionalidad / reglas importantes:
 * - Mantener `overflow: "visible"` en wrappers que deben
 *   permitir overlays (selects, dropdowns, etc.).
 * - Evitar valores arbitrarios de `zIndex`; usarlos con criterio.
 * - Usar `COLORS` y `TYPOGRAPHY` desde `theme`.
 *
 * Restricciones del proyecto:
 * - Este archivo solo contiene definiciones de `StyleSheet`.
 * - No incluye lógica de presentación ni side-effects.
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.white
  },

  scrollContent: {
    width: "100%",
    maxWidth: 900,
    paddingVertical: 16,
    alignSelf: "center",
    gap: 12,
  },

  formCard: {
  marginBottom: 20,
},



  label: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 6,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  estanqueInfo: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textTertiary,
  },

  footerContent: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
  },
  footerActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
  },
  alertWrapper: { width: "100%", alignSelf: "stretch" },
  alertBox: { width: "100%", alignSelf: "stretch" },
  alertText: { textAlign: "center", fontWeight: "bold" },
  errorBanner: { marginTop: 12, width: "100%" },
  errorText: { textAlign: "center", fontFamily: TYPOGRAPHY.fontFamily.bold },
});

