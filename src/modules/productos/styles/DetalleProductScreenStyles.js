/**
 * ============================================================
 * STYLES: DETALLEPRODUCTSCREENSTYLES
 * ============================================================
 * Módulo: Productos
 *
 * Estilos y mapeo de colores por categoría para
 * DetalleProductoScreen.jsx.
 *
 * FUNCIONALIDAD:
 * 1. colorCategoria: mapa de fondo/texto por cada categoría de
 *    producto, usado para pintar el badge de categoría.
 * 2. colorCategoriaDefault: color de respaldo si la categoría del
 *    producto no está en el mapa.
 * 3. styles: estilos de layout de toda la pantalla (navbar, tarjeta
 *    de info, botones de acción, modal de confirmación).
 *
 * IMPORTANTE:
 * - botonEditar/botonEliminar solo agregan borderColor: el fondo
 *   blanco y el resto del outline lo pone Button variant="outline".
 * - botonModalEliminar todavía tiene backgroundColor: COLORS.error
 *   pendiente de sacar (ver punto de botones rellenos del modal).
 * ============================================================
 */


import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors.js";


export const colorCategoria = {
    Alimentación: { fondo: COLORS.warningLight, texto: COLORS.warning },
    Tratamiento: { fondo: COLORS.secondary, texto: COLORS.primary },
    Químico: { fondo: COLORS.secondary, texto: COLORS.primary },
    Fertilizante: { fondo: COLORS.secondary, texto: COLORS.primary },
    Antibiótico: { fondo: COLORS.secondary, texto: COLORS.primary },
    Probiótico: { fondo: COLORS.successLight, texto: COLORS.success },
};

export const colorCategoriaDefault = {
    fondo: COLORS.secondary,
    texto: COLORS.textTertiary,
};

export const styles = StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: COLORS.surface },
    navbar: { backgroundColor: COLORS.primary, borderBottomWidth: 0 },
    navbarTitulo: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: undefined,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderWidth: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginTop: 0,
    },
    contentContainer: { paddingBottom: 40 },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    tarjeta: { marginBottom: 20, borderColor: COLORS.secondary },
    tarjetaEncabezado: { marginBottom: 12 },
    nombreProducto: { color: COLORS.textSecondary },
    badgeStockBajo: { marginBottom: 8 },
    badgeCategoria: { marginBottom: 16 },

    detallesSeccion: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.secondary,
        paddingTop: 12,
    },

    sectionTitle: { color: COLORS.textSecondary, marginBottom: 12, marginTop: 8 },
    filaDetalle: { marginBottom: 10 },
    botonesSeccion: { flexDirection: "row", gap: 12, marginTop: 20 },
    botonAccion: {
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
    // estilos del modal de confirmación
    modalTitulo: { color: COLORS.textSecondary, marginBottom: 8 },
    modalTexto: { marginBottom: 16 },
    botonModalEliminar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.error,
    },
    alertEliminado: {
        marginTop: 16,
    },
    modalCancelButton: {
        backgroundColor: COLORS.textTertiary,
    },
    modalOverlay: {
        backgroundColor: "#00000066",
    },
    modalContainer: {
        width: "100%",
        maxWidth: 900,
        alignSelf: "center",
    },
    loadingContainer: {
        justifyContent: "center",
    }
});