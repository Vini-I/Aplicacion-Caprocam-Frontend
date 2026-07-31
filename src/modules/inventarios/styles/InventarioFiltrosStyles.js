/**
 * ============================================================
 * STYLES: InventarioFiltrosStyles
 * ============================================================
 *
 * Responsabilidad:
 * Estilos visuales del componente components/InventarioFiltros.jsx
 * 
 * Estilos principales:
 *  botonFiltro: Botón que abre el modal de filtros
 *  contenidoBoton: Fila con ícono y texto del botón
 *  modalContainer: Contenedor del modal con altura máxima
 *  scroll: ScrollView dentro del modal
 *  tituloSeccion: Título de cada sección de filtros
 *  filaChips: Contenedor de chips con wrap
 * 
 *  Dependencias:
 *  theme/colors.js.
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
  botonFiltro: {
    height: 43,
    marginTop: 0,
    marginBottom: 8.5,
    flexShrink: 0,
  },

  contenidoBoton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  modalContainer: {
    maxHeight: "80%",
    padding: 16,
  },

  scroll: {
    width: "100%",
  },

  tituloSeccion: {
    marginBottom: 8,
  },

  filaChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});