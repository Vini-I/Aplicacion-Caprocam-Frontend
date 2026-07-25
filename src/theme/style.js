/**
 * ============================================================
 * ESTILOS GLOBALES DE LAYOUT
 * ============================================================
 *
 * Responsabilidad:
 * - Define el layout base de pantallas.
 * - Evita que cada modulo invente margenes o anchos distintos.
 * - Mantiene el patron container + contentWrapper.
 */

import { StyleSheet } from "react-native";
import { COLORS } from "./colors.js";

export const STYLE = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  contentWrapper: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
});
