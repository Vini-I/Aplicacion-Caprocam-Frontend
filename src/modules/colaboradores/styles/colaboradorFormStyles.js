/**
 * ESTILOS: colaboradorFormStyles
 * Agrupa las hojas de estilo del formulario de colaboradores,
 * garantizando consistencia visual y adaptabilidad.
 *
 * @dependencies - COLORS de theme/colors.js
 * @validations  - Resalta campos con error (borde rojo).
 *               - Alertas de error/éxito alineadas al centro.
 * @navigation   - N/A (archivo de estilos).
 */

import { StyleSheet } from "react-native";
import { COLORS } from '../../../theme/colors';

export const styles = StyleSheet.create({
  // ── Contenedor principal ────────────────────────────────────
  container: {
    flex: 1,
    paddingVertical: 8,
  },

  // ── Card del formulario ─────────────────────────────────────
  cardContainer: {
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },

  // ── Botones ──────────────────────────────────────────────────
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  submitButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },

  // ── Estados y validación ────────────────────────────────────
  loader: {
    marginTop: 4,
    marginBottom: 8,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },

  // ── Alertas ──────────────────────────────────────────────────
  alertContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  alertText: {
    textAlign: "center",
    fontSize: 13,
    width: "100%",
  },

  // ── Botón Restablecer PIN (solo edición) ────────────────────
  resetButtonContainer: {
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  resetButton: {
    width: "100%",
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 8,
  },
    buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});