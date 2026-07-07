/**
 * ============================================================
 * ESTILOS - TRAZABILIDAD FORM
 * ============================================================
 *
 * Descripción:
 * Estilos para el formulario de trazabilidad utilizado en el
 * componente `TrazabilidadForm`. Contiene estilos para el
 * layout del formulario, tarjetas, y wrappers específicos que
 * controlan el posicionamiento y el z-index de los `Select`.
 *
 * Funcionalidad / reglas importantes:
 * - Mantener `overflow: "visible"` y `position: "relative"` en
 *   los wrappers que deben permitir desplegar overlays.
 * - Evitar valores arbitrarios en `zIndex`; usarlos sólo cuando
 *   sea necesario y documentar por qué (evitar efectos secundarios).
 * - No modificar los componentes compartidos (`shared/components/*`).
 *
 * Restricciones del proyecto:
 * - Los colores y tipografías deben venir de `theme/colors` y
 *   `theme/typography` respectivamente.
 * - Este archivo contiene únicamente estilos (StyleSheet) y no
 *   debe contener lógica de presentación.
 */

import { StyleSheet } from "react-native";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    gap: 12,
    position: "relative",
    zIndex: 10,
    elevation: 10,
    overflow: "visible",
  },
  cardTitle: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  label: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: 6,
  },
  field: {
    marginBottom: 16,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  plNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  movimientoCard: {
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
    zIndex: 4000,
    elevation: 4000,
  },
  selectWrapperOrigen: {
    zIndex: 3000,
    elevation: 3000,
  },
  selectWrapperDestino: {
    zIndex: 2000,
    elevation: 2000,
  },
  selectWrapperColaborador: {
    zIndex: 1000,
    elevation: 1000,
  },
  selectContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
    width: "100%",
  },
  selectAbsoluteWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
    width: "100%",
  },
  selectPlaceholder: {
    height: 110,
  },
  selectLabel: {
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },
  selectButton: {
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },
  selectField: {
    position: "relative",
    marginBottom: 0,
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
  },
});

