/**
 * DetalleProveedorStyles.js
 * Estilos para la pantalla de detalle de un proveedor.
 *
 * FUNCIONALIDAD:
 * - Provee todos los estilos visuales para DetalleProveedorScreen.
 * - Define el espaciado y colores de las secciones de contacto.
 * - Incluye los estilos para renderizar el badge de tipo de producto.
 * - Asegura la legibilidad de las notas usando estilos de tipografía.
 *
 * REGLAS IMPORTANTES:
 * - Se deben usar constantes del tema (COLORS, TYPOGRAPHY) siempre.
 * - Los botones usan borde y no fondo sólido, según diseño (outline).
 * - No define paddings generales, eso lo maneja STYLE.container.
 *
 * @dependencies - StyleSheet, COLORS, TYPOGRAPHY, theme/style
 * @validations - N/A
 * @navigation - N/A
 */
import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  volverButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
  },

  volverButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },

  scroll: { 
    flex: 1 
  },

  scrollContainer: {
    paddingBottom: 24,
  },

  spinner: {
    marginTop: 40,
  },

  tarjeta: {
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  avatarIniciales: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.primary,
  },

  proveedorInfo: { 
    flex: 1 
  },

  badge: {
    marginTop: 6,
    alignSelf: "flex-start",
  },

  badgeTexto: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },

  seccion: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingTop: 12,
  },

  seccionTituloRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  seccionTitulo: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.black,
  },

  seccionNotas: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingTop: 12,
  },

  filaDetalle: {
    marginBottom: 12,
  },

  filaEtiqueta: {
    marginBottom: 2,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.textSecondary,
  },

  filaValor: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },

  notasValor: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },

  botones: {
    flexDirection: "row",
    gap: 12,
  },

  boton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
  },

  botonEditar: {
    borderColor: COLORS.primary,
  },

  botonEliminar: {
    borderColor: COLORS.error,
  },

  botonTexto: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },

  botonTextoEditar: {
    color: COLORS.primary,
  },

  botonTextoEliminar: {
    color: COLORS.error,
  },

});

