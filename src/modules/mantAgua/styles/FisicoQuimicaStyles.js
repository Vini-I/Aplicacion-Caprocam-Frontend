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
    position: "relative",
    zIndex: 100,
    elevation: 100,
    overflow: "visible",

  },

  selectWrapper: {
    position: "relative",
    height: 110,
    marginBottom: 16,
    overflow: "visible",
  },
  selectWrapperFinca: {
    zIndex: 3000,
    elevation: 3000,
  },
  selectWrapperEstanque: {
    zIndex: 2000,
    elevation: 2000,
  },
  selectContainer: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
    width: "100%",
  },
  selectField: {
    position: "relative",
    marginBottom: 0,
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
  },
  selectLabel: { position: "relative", zIndex: 1000, elevation: 1000 },
  selectButton: { position: "relative", zIndex: 1000, elevation: 1000 },
  selectPlaceholder: { height: 110 },


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

