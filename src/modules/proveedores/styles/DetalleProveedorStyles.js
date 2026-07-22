/**
 * ============================================================
 * ESTILOS DETALLE PROVEEDOR
 * ============================================================
 *
 * Estilos de la pantalla DetalleProveedorScreen, incluyendo el estado
 * proveedor no encontrado y el modal de confirmación de eliminar.
 *
 * FUNCIONALIDAD:
 * 1. Colores y tipografia salen de theme/colors y theme/typography.
 * 
 * 2. El card y los botones no definen ancho/centrado propio: eso lo
 *    resuelve STYLE.contentWrapper (theme/style) desde la screen. El
 *    padding raíz tampoco se define aquí.
 * 
 * 3. Todos los botones (Editar, Eliminar, Volver, confirmar eliminar,
 *    cancelar eliminar) son outline (borde + icono + texto de color,
 *    sin relleno sólido): azul (COLORS.primary) para acciones
 *    neutras/editar/volver/cancelar, rojo (COLORS.error) para eliminar.
 * 
 * 4. seccionNotas comparte el mismo formato de seccion para que la
 *    seccion de notas (icono + titulo) luzca igual al resto cuando se
 *    renderiza condicionalmente.
 *
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

