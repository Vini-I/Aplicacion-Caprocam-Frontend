/**
 * ============================================================
 * ESTILOS GLOBALES DE LAYOUT
 * ============================================================
 *
 * Responsabilidad:
 * - Define estilos base compartidos entre pantallas.
 * - Mantiene container y contentWrapper reutilizables.
 */

import { StyleSheet } from "react-native";
import { COLORS } from "./colors.js";

export const STYLE = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },

  contentWrapper: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
});
