import React, { useState } from "react";
import { View, ScrollView, Text, Pressable, StyleSheet } from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Navbar from "../../../shared/components/Navbar";
import Select from "../../../shared/components/Select";
import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

const TIPOS_PRODUCTO = [
    { label: "Alimento", value: "alimento" },
    { label: "Antibióticos", value: "antibioticos" },
    { label: "Fertilizantes", value: "fertilizantes" },
    { label: "Probióticos", value: "probioticos" },
    { label: "Equipos", value: "equipos" },
];

const PROVEEDORES = [
    { label: "Biomar", value: "Biomar" },
    { label: "Farivet", value: "Farivet" },
    { label: "Trisan", value: "Trisan" },
];

export default function NuevoProveedorScreen() {
    const [nombre, setNombre] = useState("");
    const [tipoProducto, setTipoProducto] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [notas, setNotas] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [mensajeVariant, setMensajeVariant] = useState("info");

    function guardar() {
        if (nombre === "") {
            setMensaje("Debe ingresar el nombre de la empresa.");
            setMensajeVariant("danger");
            return;
        }

        if (tipoProducto === "") {
            setMensaje("Debe seleccionar el tipo de producto.");
            setMensajeVariant("danger");
            return;
        }

        const proveedor = {
            nombre,
            tipoProducto,
            telefono,
            correo,
            direccion,
            notas,
        };

        console.log("Proveedor guardado:", proveedor);
        setMensaje("Proveedor guardado correctamente.");
        setMensajeVariant("success");
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerSubtitle}>Proveedores</Text>
                <Text style={styles.headerTitle}>Nuevo proveedor</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {mensaje !== "" && (
                    <Alert
                        message={mensaje}
                        variant={mensajeVariant}
                        style={styles.alert}
                    />
                )}

                <Card>
                    <Select
                        label="Nombre de la empresa"
                        value={nombre}
                        onChange={setNombre}
                        options={PROVEEDORES}
                        placeholder="Seleccione un proveedor"
                        labelStyle={styles.selectLabel}
                    />

                    <Select
                        label="Tipo de producto que provee"
                        value={tipoProducto}
                        onChange={setTipoProducto}
                        options={TIPOS_PRODUCTO}
                        placeholder="Seleccione un tipo de producto"
                        labelStyle={styles.selectLabel}
                    />

                    <Input
                        label="Teléfono"
                        value={telefono}
                        onChangeText={setTelefono}
                        placeholder="+506 2222-3344"
                        keyboardType="phone-pad"
                    />

                    <Input
                        label="Correo electrónico"
                        value={correo}
                        onChangeText={setCorreo}
                        placeholder="ventas@empresa.com"
                        keyboardType="email-address"
                    />

                    <Input
                        label="Dirección"
                        value={direccion}
                        onChangeText={setDireccion}
                        placeholder="San José, Costa Rica"
                    />

                    <Input
                        label="Notas"
                        value={notas}
                        onChangeText={setNotas}
                        placeholder="Observaciones adicionales..."
                        multiline={true}
                    />
                </Card>

                <Button onPress={guardar}>Guardar proveedor</Button>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingTop: 20,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerTitle: {
        fontSize: 30,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        color: COLORS.white,
    },
    headerSubtitle: {
        fontSize: 14,
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        color: COLORS.white,
        opacity: 0.9,
    },
    content: {
        padding: 16,
        width: "100%",
        maxWidth: 900,
        alignSelf: "center",
    },
    alert: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.white,
    },
    chipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        fontSize: 14,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        color: COLORS.textSecondary,
    },
    chipTextSelected: {
        color: COLORS.white,
    },
    selectLabel: {
    color: COLORS.textSecondary,
    },
});