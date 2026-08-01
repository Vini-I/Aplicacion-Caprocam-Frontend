/**
 * ============================================================
 * STYLES: DETALLECOMPRADORSTYLES
 * ============================================================
 * Módulo: Compradores
 *
 * Estilos de DetalleCompradorScreen.jsx.
 *
 * FUNCIONALIDAD:
 * 1. Layout del navbar, la tarjeta de datos del comprador, los
 *    botones de Editar/Eliminar y el modal de confirmación.
 *
 * IMPORTANTE:
 * - botonEliminar solo agrega borderColor: COLORS.error, se
 *   combina con "boton" en el JSX. No lleva backgroundColor.
 * - modalConfirmButton tampoco debe llevar backgroundColor: el
 *   fondo lo pone Button variant="outline".
 * ============================================================
 */

import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  navbar: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
  },

  navbarTitulo: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "left",
    marginTop: 8,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 6,
  },

  scroll: { 
    flex: 1 
  },

  contenido: {
    paddingTop: 30,
    paddingBottom: 40,
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

  compradorInfo: { 
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

  seccionTitulo: {
    marginBottom: 12,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
    color: COLORS.textSecondary,
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
  },

 botonEditar: { borderColor: COLORS.primary },     

 botonEliminar: { borderColor: COLORS.error },
 botonTexto: {
  fontSize: 14,
  fontFamily: TYPOGRAPHY.fontFamily.bold,
 },
 
 botonTextoEditar: { color: COLORS.primary },

 botonTextoEliminar: { color: COLORS.error },

  modalCancelButton: { 
    backgroundColor: COLORS.textTertiary 
  },

  modalOverlay: { 
    backgroundColor: "#00000066" 
  },

  modalContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  modalTitle: { alignSelf: "center" },

  modalMessage: {
    alignSelf: "center",
    color: COLORS.textTertiary,
  },

  modalNombreNegrita: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },

  modalConfirmButton: {
  marginTop: 12,
  flexDirection: "row",
  backgroundColor: COLORS.error,
 },

  alertEliminado: {
    marginTop: 16,
  },

  modalConfirmTexto: {
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontWeight: undefined,
  },

  loadingContainer: {
    justifyContent: "center",
  },
});

export const ICON_SIZE = {
  navbar: 22,
  boton: 20,
  modal: 20,
};