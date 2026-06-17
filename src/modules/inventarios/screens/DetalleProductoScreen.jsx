import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProductoById, deleteProducto } from "../services/inventarioService";

import Navbar from "../../../shared/components/Navbar";
import Icon from "../../../shared/components/Icons";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import Badge from "../../../shared/components/Badge";
import Modal from "../../../shared/components/Modal";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { ICONS } from "../../../theme/icons";

const colorCategoria = {
    Alimentación: { fondo: COLORS.warningLight, texto: COLORS.warning },
    Tratamiento: { fondo: COLORS.secondary, texto: COLORS.primary },
    Químico: { fondo: COLORS.secondary, texto: COLORS.primary },
    Fertilizante: { fondo: COLORS.secondary, texto: COLORS.primary },
    Antibiótico: { fondo: COLORS.secondary, texto: COLORS.primary },
    Probiótico: { fondo: COLORS.successLight, texto: "#0D9488" },
};

const colorCategoriaDefault = {
    fondo: COLORS.secondary,
    texto: COLORS.textTertiary,
};

function FilaDetalle({ etiqueta, valor, resaltado = false }) {
    return (
        <View style={styles.filaDetalle}>
            <CustomText size={12} color={COLORS.textTertiary}>
                {etiqueta}
            </CustomText>
            <CustomText
                size={14}
                weight="600"
                color={resaltado ? COLORS.error : COLORS.textSecondary}
            >
                {valor}
            </CustomText>
        </View>
    );
}

export default function DetalleProductoScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const producto = getProductoById(id);
    const [modalEliminarVisible, setModalEliminarVisible] = useState(false);

    if (!producto) {
        return (
            <View style={styles.contenedor}>
                <Navbar
                    title="Producto no encontrado"
                    style={styles.navbar}
                    leftContent={
                        <Button
                            variant="outline"
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Icon icon={ICONS.back} size={22} color={COLORS.white} />
                        </Button>
                    }
                />
                <View style={styles.emptyContainer}>
                    <CustomText>El producto no existe</CustomText>
                </View>
            </View>
        );
    }

    const tieneStockBajo = producto.cantidad < producto.stockMinimo;
    const colores = colorCategoria[producto.categoria] || colorCategoriaDefault;
    const precioFormateado = `₡${producto.precioUnidad.toLocaleString("es-CR")}`;
    const stockTotalFormateado = `₡${(
        producto.precioUnidad * producto.cantidad
    ).toLocaleString("es-CR")}`;

    function handleEditar() {
        router.push({
            pathname: "/(drawer)/inventarios/productForm",
            params: { productoParam: JSON.stringify(producto) },
        });
    }

    function handleEliminar() {
        setModalEliminarVisible(true);
    }

    function confirmarEliminar() {
        deleteProducto(producto.id);
        setModalEliminarVisible(false);
        router.replace("/(drawer)/inventarios/inventarioScreen");
    }

    return (
        <View style={styles.contenedor}>
            <Navbar
                title="Detalle de Producto"
                style={styles.navbar}
                titleStyle={styles.navbarTitulo}
                leftContent={
                    <Button
                        variant="outline"
                        onPress={() => router.replace("/(drawer)/inventarios/inventarioScreen")}
                        style={styles.backButton}
                    >
                        <Icon icon={ICONS.back} size={22} color={COLORS.white} />
                    </Button>
                }
            />

            <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Card style={styles.tarjeta}>
                    <View style={styles.tarjetaEncabezado}>
                        <Title level={4} style={styles.nombreProducto}>
                            {producto.nombre}
                        </Title>
                    </View>

                    {tieneStockBajo && (
                        <Badge
                            label="▲ Stock bajo"
                            variant="danger"
                            style={styles.badgeStockBajo}
                        />
                    )}

                    <Badge
                        label={producto.categoria}
                        style={[styles.badgeCategoria, { backgroundColor: colores.fondo }]}
                        textStyle={{ color: colores.texto }}
                    />

                    <View style={styles.detallesSección}>
                        <Title level={5} style={styles.sectionTitle}>
                            Información General
                        </Title>

                        <FilaDetalle
                            etiqueta="Cantidad actual"
                            valor={`${producto.cantidad} ${producto.unidad}`}
                            resaltado={tieneStockBajo}
                        />
                        <FilaDetalle etiqueta="Stock mínimo" valor={`${producto.stockMinimo} ${producto.unidad}`} />
                        <FilaDetalle etiqueta="Categoría" valor={producto.categoria} />
                        <FilaDetalle etiqueta="Proveedor" valor={producto.proveedor} />

                        <Title level={5} style={styles.sectionTitle}>
                            Información Económica
                        </Title>

                        <FilaDetalle etiqueta="Precio por unidad" valor={precioFormateado} />
                        <FilaDetalle
                            etiqueta="Valor total en stock"
                            valor={stockTotalFormateado}
                        />
                    </View>
                </Card>

                <View style={styles.botonesSección}>
                    <Button
                        style={[styles.botonAccion, styles.botonEditar]}
                        onPress={handleEditar}
                    >
                        <Icon icon={ICONS.edit} size={20} color={COLORS.white} />
                        <CustomText color={COLORS.white} weight="600" size={14}>
                            Editar
                        </CustomText>
                    </Button>

                    <Button
                        style={[styles.botonAccion, styles.botonEliminar]}
                        onPress={handleEliminar}
                    >
                        <Icon icon={ICONS.delete} size={20} color={COLORS.white} />
                        <CustomText color={COLORS.white} weight="600" size={14}>
                            Eliminar
                        </CustomText>
                    </Button>
                </View>
            </ScrollView>

            <Modal
                visible={modalEliminarVisible}
                onClose={() => setModalEliminarVisible(false)}
                closeText="Cancelar"
            >
                <Title level={5} style={styles.modalTitulo}>
                    Eliminar producto
                </Title>
                <CustomText size={14} color={COLORS.textSecondary} style={styles.modalTexto}>
                    ¿Está seguro que desea eliminar "{producto.nombre}"? Esta acción no se puede deshacer.
                </CustomText>
                <Button style={styles.botonModalEliminar} onPress={confirmarEliminar}>
                    <Icon icon={ICONS.delete} size={18} color={COLORS.white} />
                    <CustomText color={COLORS.white} weight="600" size={14}>
                        Eliminar
                    </CustomText>
                </Button>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: COLORS.surface },
    navbar: { backgroundColor: COLORS.primary, borderBottomWidth: 0 },
    navbarTitulo: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
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
    contentContainer: { padding: 16, paddingBottom: 40 },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    tarjeta: { marginBottom: 20, borderColor: COLORS.secondary },
    tarjetaEncabezado: { marginBottom: 12 },
    nombreProducto: { color: COLORS.textSecondary },
    badgeStockBajo: { marginBottom: 8 },
    badgeCategoria: { marginBottom: 16 },
    detallesSección: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.secondary,
        paddingTop: 12,
    },
    sectionTitle: { color: COLORS.textSecondary, marginBottom: 12, marginTop: 8 },
    filaDetalle: { marginBottom: 10 },
    botonesSección: { flexDirection: "row", gap: 12, marginTop: 20 },
    botonAccion: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
    },
    botonEditar: { backgroundColor: COLORS.primary },
    botonEliminar: { backgroundColor: COLORS.error },
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
});