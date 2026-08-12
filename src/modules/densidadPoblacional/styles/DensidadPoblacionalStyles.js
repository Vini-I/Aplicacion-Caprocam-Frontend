/**
 * ============================================================
 * ESTILOS DENSIDADPOBLACIONALSTYLES
 * ============================================================
 *
 * Agrupa los estilos del modulo de Densidad Poblacional: fondo
 * de pantalla, wrapper de contenido centrado, subtitulos de
 * seccion, etiquetas de campo y el boton de guardar.
 *
 * Funcionalidad:
 * - container usa COLORS.white para ser
 *   visualmente consistente con Alimentacion y Raleo.
 * - content y addButton reutilizan STYLE.contentWrapper de
 *   theme/style.js en vez de redefinir manualmente
 *   maxWidth/alignSelf/width en cada uno.
 * - Se eliminaron los estilos que ningun archivo de este modulo
 *   usa (verificado con busqueda antes de eliminar): backBtn,
 *   headerTitle, headerTitleText, header, title, buttonText,
 *   fechaContainer, fechaInput, calendarButton, row, half.
 *
 * Ejemplo:
 * import { styles } from '../styles/DensidadPoblacionalStyles';
 * <View style={styles.container}>
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";

export const styles = StyleSheet.create({

  content: {
    ...STYLE.contentWrapper,
  },

  // Deja espacio para que el boton flotante no tape la ultima card.
  scrollContent: {
    paddingBottom: 96,
  },

  // Boton "Guardar" flotante, mismo ancho que las cards (margen de
  // 16 a cada lado, igual que STYLE.container).
  floatingFooter: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },

  // Alert de exito, fijo arriba de toda la pantalla (Regla 2).
  topAlert: {
    marginHorizontal: 16,
    marginTop: 8,
  },

  alert: {
    marginTop: 12,
    marginBottom: 4,
  },

  subTitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionIcon: {
    marginRight: 8,
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: COLORS.primary
  },
  submitButton: {
    marginTop: 12,
  },

  /*
  ----------------------------------------------------------------
  Ayuda de campos autocompletados
  ----------------------------------------------------------------
  Texto corto bajo "Cantidad de siembra por m2" y "Area del
  estanque" que explica de donde salio el valor. Sube un poco
  (marginTop negativo) para quedar pegado a su campo y no parecer
  la etiqueta del campo siguiente.
  */

  ayudaAutocompletado: {
    marginTop: -6,
    marginBottom: 12,
  },

  /*
  ----------------------------------------------------------------
  Lista de tiros de atarraya
  ----------------------------------------------------------------
  Reusa los mismos valores que ya usa Input.jsx (borderColor
  COLORS.secondary, borderRadius 8) para que las filas se vean
  parte del mismo formulario y no como un bloque aparte.
  */

  tirosAyuda: {
    marginBottom: 10,
  },

  tiroFila: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 8,
  },

  // Numero del tiro. Mismo alto que el input para que quede alineado.
  tiroBadge: {
    width: 30,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryLight,
  },

  tiroCampo: {
    flex: 1,
  },

  // Anula el marginBottom por defecto del Input: el espaciado
  // entre tiros lo da tiroFila.
  tiroInputContainer: {
    marginBottom: 0,
  },

  tiroEliminar: {
    width: 38,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  agregarTiro: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    marginTop: 4,
    marginBottom: 12,
  },

  agregarTiroDeshabilitado: {
    borderColor: COLORS.textQuaternary,
    opacity: 0.6,
  },

  bordeError: {
    borderColor: COLORS.error,
  },

  /*
  ----------------------------------------------------------------
  Resultados calculados
  ----------------------------------------------------------------
  */

  resultadosSeparador: {
    height: 1,
    backgroundColor: COLORS.secondary,
    marginTop: 4,
    marginBottom: 14,
  },

});