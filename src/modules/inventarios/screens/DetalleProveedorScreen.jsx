import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProveedorById, deleteProveedor } from "../services/proveedoresService";

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

function FilaDetalle({ etiqueta, valor }) {
    return (
        <View style={styles.filaDetalle}>
            <CustomText size={12} color={COLORS.textTertiary}>
                {etiqueta}
            </CustomText>
            <CustomText size={14} weight="600" color={COLORS.textSecondary}>
                {valor}
            </CustomText>
        </View>
    );
}

export default function DetalleProveedorScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const proveedor = getProveedorById(id);
    const [modalEliminarVisible, setModalEliminarVisible] = useState(false);

    if (!proveedor) {
        return (
            <View style={styles.contenedor}>
                <Navbar
                    title="Proveedor no encontrado"
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
                    <CustomText>El proveedor no existe</CustomText>
                </View>
            </View>
        );
    }

    function handleEditar() {
        router.push({
            pathname: "/(drawer)/inventarios/editarProveedor",
            params: { id: proveedor.id.toString() },
        });
    }

    function handleEliminar() {
        setModalEliminarVisible(true);
    }

    function confirmarEliminar() {
        deleteProveedor(proveedor.id);
        setModalEliminarVisible(false);
        router.replace("/(drawer)/inventarios/proveedorScreen");
    }

    return (
        <View style={styles.contenedor}>
            <Navbar
                title="Detalle de Proveedor"
                style={styles.navbar}
                titleStyle={styles.navbarTitulo}
                leftContent={
                    <Button
                        variant="outline"
                        onPress={() => router.replace("/(drawer)/inventarios/proveedorScreen")}
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
                    <View style={styles.headerSeccion}>
                        <View style={styles.avatar}>
                            <CustomText size={24} weight="bold" color={COLORS.primary}>
                                {proveedor.iniciales}
                            </CustomText>
                        </View>
                        <View style={styles.proveedorInfo}>
                            <Title level={4}>{proveedor.nombre}</Title>
                            <Badge
                                label={proveedor.tipoProducto}
                                style={styles.tipoProductoBadge}
                            />
                        </View>
                    </View>

                    <View style={styles.detallesSección}>
                        <Title level={5} style={styles.sectionTitle}>
                            Información de Contacto
                        </Title>

                        <FilaDetalle etiqueta="Teléfono" valor={proveedor.telefono} />
                        <FilaDetalle etiqueta="Correo electrónico" valor={proveedor.correo} />
                        <FilaDetalle etiqueta="Dirección" valor={proveedor.direccion} />
                    </View>

                    {!!proveedor.notas && (
                        <View style={styles.detallesSección}>
                            <Title level={5} style={styles.sectionTitle}>
                                Notas Adicionales
                            </Title>
                            <CustomText size={13} color={COLORS.textSecondary}>
                                {proveedor.notas}
                            </CustomText>
                        </View>
                    )}
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
                    Eliminar proveedor
                </Title>
                <CustomText size={14} color={COLORS.textSecondary} style={styles.modalTexto}>
                    ¿Está seguro que desea eliminar "{proveedor.nombre}"? Esta acción no se puede deshacer.
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
    headerSeccion: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.secondary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    proveedorInfo: { flex: 1 },
    tipoProductoBadge: { marginTop: 6, alignSelf: "flex-start" },
    detallesSección: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.secondary,
        paddingTop: 12,
    },
    sectionTitle: { color: COLORS.textSecondary, marginBottom: 12 },
    filaDetalle: { marginBottom: 12 },
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