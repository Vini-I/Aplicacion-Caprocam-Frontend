/**
 * ============================================================
 * SISTEMA DE ICONOS CENTRALIZADO
 * ============================================================
 *
 * Breve: Estilos reutilizables para screens.
 *
 * - `container`: Contenedor raíz que ocupa la pantalla completa (fondo y padding).
 * - `contentWrapper`: Wrapper centrado con `maxWidth` para acomodar cards y contenido.
 *
 * Uso: aplicar `style.container` al View raíz de cada screen y envolver el contenido con `style.contentWrapper`.
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
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
});
